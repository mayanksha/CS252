import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn,
	FormControl, NgForm, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
	selector: 'app-mark-proxy',
	templateUrl: './mark-proxy.component.html',
	styleUrls: ['./mark-proxy.component.scss']
})
export class MarkProxyComponent implements OnInit {

	options: GeolocationOptions;
	/*currentPos: Geoposition;*/
	currentPos: any = {
		coords : {
			latitude : 26.512075,
			longitude : 80.233363
		}
	};
	placeType: string;
	form: FormGroup;
	studentsForm: FormGroup;
	postEndpoint = 'https://msharma.me/cs252api';
	students = [];
	courseCode: string;
	success = 0;
	allowed = false;
	allowed2 = true;
	green = '../../assets/green.png';
	red = '../../assets/red.png';
	successString = 'Oh Thou Saviour! You marked the proxy of these students! Hail you! May the SSAC be with you! ;)';
	failureString = `Oops! There was some error on our side. Try restarting , and then re-submit the form.
		If it still fails, mail your issue at msharma@iitk.ac.in and we'll get back to you!` ;

	failureString2 = `Sorry! You are not inside Academic Area and hence not allowed to mark someone's proxy! :)` ;

	// Map Stuff
	@ViewChild('map') mapElem: ElementRef;
	map: google.maps.Map;
	placesService: google.maps.places.PlacesService;
	searchRadius = 1000;
	nearbyPlaces: any[];
	polygon: google.maps.Polygon;
	area = [
		{lng : 80.2307258, lat: 26.5150339},
		{lng : 80.2307043, lat: 26.5104449},
		{lng : 80.2353392, lat: 26.5105409},
		{lng : 80.2352534, lat: 26.5150147},
		{lng : 80.2307258, lat: 26.5150339}
	];

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		public navCtrl: NavController,
		private geolocation: Geolocation
	) {
		this.options = {
			enableHighAccuracy: true
		};
	}

	getUserPosition() {
		return this.geolocation.getCurrentPosition(this.options)
			.then((pos: Geoposition) => {
				this.currentPos = pos;
				return this.currentPos;
			})
			.catch(err => {
				console.error(err);
				return Promise.reject(err);
			});
	}
	addMap() {
		const mapOptions = {
			center: new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(this.mapElem.nativeElement, mapOptions);
		this.addMarker();
		this.placesService = new google.maps.places.PlacesService(this.map);
		/*this.getNearbyPlaces();*/
	}
	addMarker() {
		const marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: this.map.getCenter()
		});

		const content = '<p>This is your current position !</p>';
		const infoWindow = new google.maps.InfoWindow({
			content: content
		});

		google.maps.event.addListener(marker, 'click', () => {
			infoWindow.open(this.map, marker);
		});

	}
	ionViewDidEnter() {
		this.getUserPosition()
			.then(pos => {
				/*this.currentPos.coords.latitude = 26.512075;
				 *this.currentPos.coords.longitude = 80.233363;*/
				this.addMap();
				return this.currentPos;
			})
			.then((foo) => {
				console.log(foo);
				this.drawAreaPolygon();
				const latLng = new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);
				console.log('Is point within bounds?');
				setTimeout(() => {
					this.allowed = google.maps.geometry.poly.containsLocation(latLng, this.polygon);
					if (this.allowed === false) {
						this.allowed2 = false;
					}
				}, 2500);
				console.log(google.maps.geometry.poly.containsLocation(latLng, this.polygon));
			})
			.catch(console.error);
	}
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

	drawAreaPolygon() {
		this.polygon = new google.maps.Polygon(<google.maps.PolygonOptions>{
			path: this.area,
			geodesic: true,
			strokeColor: '#FFd000',
			strokeOpacity: 1.0,
			strokeWeight: 4,
			fillColor: '#FFd000',
			fillOpacity: 0.35
		});
		this.polygon.setMap(this.map);
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
