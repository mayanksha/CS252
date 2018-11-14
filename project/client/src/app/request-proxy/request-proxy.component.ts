import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn,
	FormControl, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

interface StudentData {
	rollno: number;
	courses: string[];
}

@Component({
	selector: 'app-request-proxy',
	templateUrl: './request-proxy.component.html',
	styleUrls: ['./request-proxy.component.scss']
})
export class RequestProxyComponent implements OnInit {

	form: FormGroup;
	courseForm: FormGroup;
	postEndpoint = 'https://msharma.me/cs252api';
	courses: any[];
	coursesIds = [];
	rollno: number;
	success = 0;
	green = '../../assets/green.png';
	red = '../../assets/red.png';
	successString = 'Keep Your Fingers Crossed! Someone will mark your proxy soon! ;)';
	failureString = `Oops! There was some error on our side. Try restarting , and then re-submit the form.
		If it still fails, mail your issue at msharma@iitk.ac.in and we'll get back to you!` ;
	constructor(
		private fb: FormBuilder,
		private http: HttpClient
	) {
		this.courses = [];
	}

	ngOnInit() {
		this.form = this.fb.group({
			rollno: ['', Validators.required],
		});
		this.courseForm = this.fb.group({
			courses: this.fb.array([])
		});
	}

	buildCourseControls() {
		const formArray = this.courseForm.get('courses') as FormArray;
		while (formArray.length !== 0) {
			formArray.removeAt(0);
		}
		this.courses.forEach((e) => formArray.push(new FormControl(false)));
	}
	updateCheckedOptions(location: any, isChecked: boolean) {
		const courses = <FormArray>this.courseForm.controls.courses;
		courses.controls[location.id].patchValue(!courses.controls[location.id].value);
	}
	onSubmit() {
		this.courses = [];
		this.rollno = null;
		return this.http.post(`${this.postEndpoint}/getCourses`, this.form.value, {
			withCredentials: true
		}).toPromise()
			.then((val: StudentData) => {
				console.log(val);
				for (let i = 0; i < val.courses.length; i++) {
					this.courses.push({
						'id': i,
						'course': val.courses[i],
						'selected': false
					});
				}
				console.log(this.courses);
				this.rollno = val.rollno;
				setTimeout(() => {
					this.buildCourseControls();
				}, 0);
			})
			.catch(err => {
				this.success = 2;
				console.error(err);
			});
	}
	/*tslint:disable*/	
	onCourseSubmit() {
		let form = {
			"rollno": this.rollno,
			"courses": []
		};
		let flag = 0;
		for(let i = 0; i < this.courses.length; i++){
			if (this.courseForm.value.courses[i] === true){
				flag = 1;
				form.courses.push(this.courses[i].course);
			}
		}
		if (flag === 0){
			alert('You Must select atleast one course!');
			return;
		}
		console.log(form);
		return this.http.post(`${this.postEndpoint}/requestProxy`, form, {
			withCredentials: true
		}).toPromise()
			.then((val: StudentData) => {
				console.log(val);
				this.success = 1;
			})
			.catch(err => {
				this.success = 2;
				console.error(err);
		  });
	}
}
