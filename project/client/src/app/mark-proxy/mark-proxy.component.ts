import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn,
	FormControl, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-mark-proxy',
	templateUrl: './mark-proxy.component.html',
	styleUrls: ['./mark-proxy.component.scss']
})
export class MarkProxyComponent implements OnInit {

	form: FormGroup;
	studentsForm: FormGroup;
	postEndpoint = 'http://10.0.2.2:3000';
	students = [];
	courseCode: string;
	success = 0;
	green = '../../assets/green.png';
	red = '../../assets/red.png';
	successString = 'Oh Thou Saviour! You marked the proxy of these students! Hail you! May the SSAC be with you! ;)';
	failureString = `Oops! There was some error on our side. Try restarting , and then re-submit the form.
		If it still fails, mail your issue at msharma@iitk.ac.in and we'll get back to you!` ;
	constructor(
		private fb: FormBuilder,
		private http: HttpClient
	) {}

	ngOnInit() {
		this.form = this.fb.group({
			courseCode: ['', Validators.required],
		});
		this.studentsForm = this.fb.group({
			students: this.fb.array([])
		});
	}
	buildCourseControls() {
		const formArray = this.studentsForm.get('students') as FormArray;
		while (formArray.length !== 0) {
			formArray.removeAt(0);
		}
		console.log(this.students);
		this.students.forEach((e) => formArray.push(new FormControl(false)));
	}
	updateCheckedOptions(location: any, isChecked: boolean) {
		const students = <FormArray>this.studentsForm.controls.students;
		console.log(location);
		students.controls[location.id].patchValue(!students.controls[location.id].value);
	}
	onSubmit() {
		this.students = [];
		return this.http.post(`${this.postEndpoint}/getProxyRequests`, this.form.value, {
			withCredentials: true
		}).toPromise()
			.then((val: any) => {
				console.log(val);
				for (let i = 0; i < (val as any).students.length; i++) {
					this.students.push({
						'id': i,
						'rollno': val.students[i].rollno,
						'name': val.students[i].name,
						'proxy_marked': val.students[i].proxy_marked,
						'selected': false
					});
				}
				this.courseCode = this.form.value.courseCode;
				this.buildCourseControls();
			})
			.catch(err => {
				console.error(err);
				this.success = 2;
			});
	}
	onStudentSubmit() {
		const form = {
			'rollnos': [],
			'course_code': this.courseCode
		};
		for (let i = 0; i < this.students.length; i++) {
			if (this.studentsForm.value.students[i] === true) {
				form.rollnos.push(this.students[i].rollno);
			}
		}
		console.log(form);
		/*console.log(this.studentsForm.value);*/
		return this.http.post(`${this.postEndpoint}/markProxy`, form, {
			withCredentials: true
		}).toPromise()
			.then((val) => {
				console.log(val);
				this.success = 1;
			})
			.catch(err => {
				console.error(err);
				this.success = 2;
			});
	}

}
