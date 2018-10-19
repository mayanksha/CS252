import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NearbyPlacesComponent } from './nearby-places/nearby-places.component';
@NgModule({
	declarations: [AppComponent,
		GoogleMapsComponent,
		NearbyPlacesComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		Geolocation,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
