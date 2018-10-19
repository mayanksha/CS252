import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { NearbyPlacesComponent } from './nearby-places/nearby-places.component';
const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: './home/home.module#HomePageModule'
	},
	{
		path: 'list',
		loadChildren: './list/list.module#ListPageModule'
	},
	{
		path: 'maps',
		component: GoogleMapsComponent
	},
	{
		path: 'nearby',
		component: NearbyPlacesComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
