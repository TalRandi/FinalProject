import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ZimmerListComponent } from './zimmer-list/zimmer-list.component';
import { ZimmerDetailsComponent } from './zimmer-details/zimmer-details.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch:'full'},
  
  {path: 'home', component: AppComponent},
  // {path: 'publishing', component: ShoppingListComponent}
  
  // {path: 'recipes', component: RecipesComponent, children:[
  //     {path:'', component:RecipeStartComponent},
  //     {path:'new', component:RecipeEditComponent, resolve:[RecipesResolverService]},
  //     {path:':id', component:RecipeDetailComponent, resolve:[RecipesResolverService]},
  //     {path:':id/edit', component:RecipeEditComponent}
  // ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
