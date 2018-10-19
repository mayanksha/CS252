import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NearbyPlacesComponent } from './nearby-places/nearby-places.component';
import { RequestProxyComponent } from './request-proxy/request-proxy.component';
import { MarkProxyComponent } from './mark-proxy/mark-proxy.component';
import { ViewProxyComponent } from './view-proxy/view-proxy.component';
import { HomeComponent } from './home/home.component';
@NgModule({
	declarations: [AppComponent,
		NearbyPlacesComponent,
		RequestProxyComponent,
		MarkProxyComponent,
		ViewProxyComponent,
		HomeComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		HttpClientModule,
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
