import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
/*import {} from 'googlemaps';*/
function haversineDistance(coords1, coords2, isMiles) {
	function toRad(x) {
		return x * Math.PI / 180;
	}
	const lon1 = coords1[1];
	const lat1 = coords1[0];

	const lon2 = coords2[1];
	const lat2 = coords2[0];

	const R = 6371; // km

	const x1 = lat2 - lat1;
	const dLat = toRad(x1);
	const x2 = lon2 - lon1;
	const dLon = toRad(x2);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c;

	if (isMiles) { d /= 1.60934; }
	return d.toFixed(2);
}
@Component({
	selector: 'app-google-maps',
	templateUrl: './google-maps.component.html',
	styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
	options: GeolocationOptions;
	currentPos: Geoposition;
	/*currentPos: any = {
	 *  coords : {
	 *    latitude : 26.514368,
	 *    longitude : 80.234864
	 *  }
	 *};*/
	@ViewChild('map') mapElem: ElementRef;
	map: google.maps.Map;
	placesService: google.maps.places.PlacesService;
	searchRadius = 1000;
	nearbyPlaces: any[];
	placeType: string;

	constructor(
		public navCtrl: NavController,
		private geolocation: Geolocation
	) {
		/*this.currentPos = new Object();*/
		this.options = {
			enableHighAccuracy: true
		};
	}

	getUserPosition() {
		return this.geolocation.getCurrentPosition(this.options)
			.then((pos: Geoposition) => {
				this.currentPos = pos;
				console.log(pos);
				return pos;
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
				/*this.currentPos.coords.latitude = 26.514368;
				 *this.currentPos.coords.longitude = 80.234864;*/
				this.addMap();
			})
			.catch(console.error);
	}
	ngOnInit() {
	}

	getLatLng() {
		return new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);
	}
	getNearbyPlaces() {
		if (this.nearbyPlaces) {
			this.nearbyPlaces = null;
		}
		return new Promise((resolve, reject) => {
			this.placesService.nearbySearch({
				location: this.getLatLng() ,
				radius: this.searchRadius,
				types: [this.placeType],
				/*rankBy: google.maps.places.RankBy.DISTANCE*/
			}, (results: google.maps.places.PlaceResult[], status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK)	{
					if (!this.nearbyPlaces) {
						this.markNearbyMarkers(results);
						this.nearbyPlaces = results;
					} else {
						this.nearbyPlaces = results;
						this.nearbyPlaces.sort((a: any, b: any) => a.distance - b.distance);
					}
					console.log(results);
					return resolve(results);
				} else { return reject(new Error('Some error occurred')); }
			});
		});
	}

	markNearbyMarkers(nearbyPlaces: google.maps.places.PlaceResult[]) {
		nearbyPlaces.map((elem) => {
			const image = {
				url: elem.icon,
				size: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(0, 32)
			};
			const marker = new google.maps.Marker({
				map: this.map,
				/*icon: image,*/
				title: elem.name,
				animation: google.maps.Animation.DROP,
				position: elem.geometry.location
			});
			const content = '<p>This is your current position !</p>';
			const infoWindow = new google.maps.InfoWindow({
				content: elem.name
			});

			google.maps.event.addListener(marker, 'click', () => {
				infoWindow.open(this.map, marker);
			});
			const lat = elem.geometry.location.lat();
			const long = elem.geometry.location.lng();
			(elem as any).distance = haversineDistance([lat, long], [this.currentPos.coords.latitude, this.currentPos.coords.longitude], false);
		});
		nearbyPlaces.sort((a: any, b: any) => a.distance - b.distance);
	}
}
