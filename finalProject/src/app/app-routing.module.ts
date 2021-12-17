import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZimmerListComponent } from './zimmer/zimmer-list/zimmer-list.component';
import { ZimmerDetailsComponent } from './zimmer/zimmer-details/zimmer-details.component';
import { CreateZimmerComponent } from './create-zimmer/create-zimmer.component';
import { ZimmerComponent } from './zimmer/zimmer.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch:'full'},
  
  {path: 'create-BnB', component: CreateZimmerComponent},
  {path: 'home', component: ZimmerComponent, children:[
      {path:'', component:ZimmerListComponent},
      {path:':id', component:ZimmerDetailsComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
