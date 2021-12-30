import { Subject } from "rxjs";
import { Zimmer } from "./zimmer.model";

export class ZimmerService{

    zimmersChanged= new Subject<Zimmer[]>();
    private zimmers: Zimmer[];

    getZimmers(){
      if(this.zimmers)
        return this.zimmers.slice();
        
        return []
    }
    setZimmers(zimmers: Zimmer[]){
        this.zimmers = zimmers;
        this.zimmersChanged.next(this.zimmers.slice());
    }  
    // Todo: check if we want to return the zimmer by index or name
    getZimmer(index: number){
      return this.zimmers[index]
    }

    // addZimmer(zimmer: Zimmer){
    //   this.zimmers.push(zimmer);
    //   this.zimmersChanged.next(this.zimmers.slice());
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