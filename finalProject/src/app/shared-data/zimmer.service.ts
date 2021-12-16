import { Subject } from "rxjs";
import { Zimmer } from "./zimmer.model";

export class ZimmerService{
    recipesChanged= new Subject<Zimmer[]>();

    // private zimmers: Zimmer[];

    // getRecipes(){
    //   if(this.recipes)  
    //     return this.recipes.slice();
    // }
    // getRecipe(index:number){
    //   return this.recipes[index]
    // }

    // addRecipe(recipe: Recipe){
    //   this.recipes.push(recipe);
    //   this.recipesChanged.next(this.recipes.slice());
    // }

    // updateRecipe(index: number, newRecipe: Recipe){
    //   this.recipes[index] = newRecipe;
    //   this.recipesChanged.next(this.recipes.slice());
    // }

    // deleteRecipe(index:number){
    //   this.recipes.splice(index, 1);
    //   this.recipesChanged.next(this.recipes.slice());
    // }
}