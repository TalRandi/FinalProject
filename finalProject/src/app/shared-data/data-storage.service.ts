import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { ZimmerService } from "./zimmer.service";
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn:'root'})
export class DataStorageService {
    
    url = 'https://bnb-israel-99206-default-rtdb.europe-west1.firebasedatabase.app/zimmers.json'
  
    constructor(private http: HttpClient, private zimmerService: ZimmerService){}

    storeZimmers(){
        const zimmers = this.zimmerService.getZimmers();
        this.http.put(this.url, zimmers).subscribe(() => {alert("Success")}); 
    }

    fetchZimmers(){
        return this.http.get< Zimmer[]>(this.url).pipe(map(zimmers => {
            return zimmers.map(zimmer => {
                return {...zimmer}
                // return {...zimmer, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }), tap(zimmers=> { this.zimmerService.setZimmers(zimmers); })
    )}   
}