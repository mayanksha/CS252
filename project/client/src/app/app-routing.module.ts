import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NearbyPlacesComponent } from './nearby-places/nearby-places.component';
import { RequestProxyComponent } from './request-proxy/request-proxy.component';
import { MarkProxyComponent } from './mark-proxy/mark-proxy.component';
import { ViewProxyComponent } from './view-proxy/view-proxy.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: HomeComponent
	},
	{
		path: 'requestProxy',
		pathMatch: 'full',
		component: RequestProxyComponent
	},
	{
		path: 'markProxy',
		pathMatch: 'full',
		component: MarkProxyComponent
	},
	{
		path: 'viewProxy',
		pathMatch: 'full',
		component: ViewProxyComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
