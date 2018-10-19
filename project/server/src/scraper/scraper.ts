const rp = require('request-promise');
const ch = require('cheerio');
const url = "http://172.26.142.68/examscheduler2/personal_schedule.php?rollno=";
const fs = require('fs');

const fileName = 'studentData.json';

let studentData = [];

interface studentInfo {
	rollNo: number,
		courses: string[]
}
function getStudentInfo(rollNo) {
	return rp(url+rollNo)
		.then((html) => {
			const $ = ch.load(html);
			const numCourses = $(".contenttable_lmenu tr").length - 1;
			/*console.log(numCourses)*/
			let info: studentInfo = {
				"rollNo": rollNo,
				"courses": []
			};
			for (let i = 1 ;i <= numCourses; i++) {
				let courseName : string = $(".contenttable_lmenu").contents()[1].children[i].children[0].children[0].data;
				info.courses.push(courseName);
			}
			/*studentData.push(info);*/
			return info;
		})
		.catch(err => {
			console.error(err);
			return err;
		});
}

// You have to execute after a certain interval else the server might block/reset the connection owing to excessive loads
for(let i = 170001; i < 170833; i++) {
	setTimeout(() => {
			getStudentInfo(i)
				.then((info) => {
					/*console.log(info);*/
					return new Promise((resolve, reject) => {
						fs.appendFile(fileName, JSON.stringify(info) + ",\n", (err) => {
							if (err) reject(err);
							else resolve(info);
						})
					})		
				})
				.then((info: studentInfo) => {
					console.log("Written for " + info.rollNo);
					i++;
				})
				.catch(console.error);
	}, (i - 170001) *10);
}
