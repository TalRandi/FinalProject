import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZimmerListComponent } from './zimmer/zimmer-list/zimmer-list.component';
import { ZimmerDetailsComponent } from './zimmer/zimmer-details/zimmer-details.component';
import { CreateZimmerComponent } from './create-zimmer/create-zimmer.component';
import { ZimmerComponent } from './zimmer/zimmer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch:'full'},
  
  {path: 'create-zimmer', component: CreateZimmerComponent},
  {path: 'login-page', component: AuthenticationComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'admin', component: AuthenticationComponent},
  {path: 'admin/pending-zimmers', component: PendingRequestsComponent, canActivate: [AuthGuard]},

 
  {path: 'home', component: ZimmerComponent, children:[
      {path:'', component:ZimmerListComponent},
      {path:':id', component:ZimmerDetailsComponent}
  ]},
  // {path: '', redirectTo: '/home', pathMatch:'prefix'}, TO DO - Not found component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
