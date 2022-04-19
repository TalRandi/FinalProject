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
import { AuthGuardAdmin } from './authentication/auth.guard.admin';
import { AuthGuardId } from './authentication/auth.guard.id';
import { MyZimmerComponent } from './zimmer/my-zimmer/my-zimmer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ZimmerOrdersComponent } from './zimmer-orders/zimmer-orders.component';
import { ClientOrdersComponent } from './client-orders/client-orders.component';
import { ClientFavoritesComponent } from './client-favorites/client-favorites.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch:'full'},
  
  {path: 'create-zimmer', component: CreateZimmerComponent},
  {path: 'login-page', component: AuthenticationComponent},
  {path: 'signup-page', component: SignUpComponent},
  {path: 'forgot-password-page', component: ForgotPasswordComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'admin', component: AuthenticationComponent},
  {path: 'admin/pending-requests', component: PendingRequestsComponent, canActivate: [AuthGuardAdmin]},
  {path: 'my-zimmer/:id', component: MyZimmerComponent, canActivate: [AuthGuardId]},
  {path: 'my-orders', component: ClientOrdersComponent, canActivate:[AuthGuard]},
  {path: 'my-orders/:id', component: ZimmerOrdersComponent, canActivate:[AuthGuardId]},
  {path: 'favorites', component: ClientFavoritesComponent, canActivate:[AuthGuard]},
 
  {path: 'home', component: ZimmerComponent, children:[
      {path:'', component:ZimmerListComponent},
      {path:':id', component:ZimmerDetailsComponent},
  ]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
