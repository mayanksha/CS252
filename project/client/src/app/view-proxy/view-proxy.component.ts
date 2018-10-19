import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn,
	FormControl, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-view-proxy',
	templateUrl: './view-proxy.component.html',
	styleUrls: ['./view-proxy.component.scss']
})
export class ViewProxyComponent implements OnInit {

	postEndpoint = 'http://10.0.2.2:3000';
	myProxyRequests: any[] = [];
	form: FormGroup;
	success = 0;
	green = '../../assets/green.png';
	red = '../../assets/red.png';
	successString = 'Oh Lord! Why did thee cancel thy requests? :(';
	failureString = `Oops! There was some error on our side. Try restarting , and then re-submit the form.
		If it still fails, mail your issue at msharma@iitk.ac.in and we'll get back to you!` ;
	constructor(private http: HttpClient, private fb: FormBuilder) { }

	ngOnInit() {

		this.form = this.fb.group({
			myRequests: this.fb.array([]),
		});
		this.http.get(`${this.postEndpoint}/getMyRequests`, {
			withCredentials: true
		}).toPromise()
			.then((val: any[]) => {
				console.log(val);
				for (let i = 0; i < val.length; i++) {
					this.myProxyRequests.push({
						'id': i,
						'course_code': val[i].course_code,
						'name': val[i].name,
						'rollno': val[i].rollno,
						'proxy_marked': val[i].proxy_marked
					});
				}
				this.buildCourseControls();
			})
			.catch((err) => {
				console.error(err);
				this.success = 2;
			});
	}
	buildCourseControls() {
		const formArray = this.form.get('myRequests') as FormArray;
		while (formArray.length !== 0) {
			formArray.removeAt(0);
		}
		console.log(this.form);
		this.myProxyRequests.forEach((e) => formArray.push(new FormControl(false)));
	}
	updateCheckedOptions(location: any, isChecked: boolean) {
		console.log(location);
		const myRequests = <FormArray>this.form.controls.myRequests;
		const startId = this.myProxyRequests[0].id;
		const prevValue = myRequests.controls[location.id - startId].value;
		myRequests.controls[location.id - startId].patchValue(!prevValue);
	}

	onSubmit() {
		const form = {
			'students': []
		};
		for (let i = 0; i < this.myProxyRequests.length; i++) {
			if (this.form.value.myRequests[i] === true) {
				form.students.push({
					'course_code': this.myProxyRequests[i].course_code,
					'rollno': this.myProxyRequests[i].rollno,
				});
			}
		}
		this.myProxyRequests = [];
		console.log(form);
		return this.http.post(`${this.postEndpoint}/cancelMyRequests`, form, {
			withCredentials: true
		}).toPromise()
			.then((val: any) => {
				console.log(val);
				this.success = 1;
			})
			.catch(err => {
				console.error(err);
				this.success = 2;
			});
	}

}
