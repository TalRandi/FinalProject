import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { ZimmerService } from "./zimmer.service";
import { map } from 'rxjs/operators';

@Injectable({ providedIn:'root' })
export class DataStorageService {
    
    // url = 'https://bnb-israel-99206-default-rtdb.europe-west1.firebasedatabase.app/zimmers.json'
    url = 'https://bnb-israel-99206-default-rtdb.europe-west1.firebasedatabase.app/pending.json'
  
    constructor(private http: HttpClient, private zimmerService: ZimmerService){}

    storeZimmer(zimmer: Zimmer){
        this.http.post(this.url, zimmer).subscribe(() => {alert("Success")}); 
    }

    fetchZimmers(){
        return this.http.get< Zimmer[]>(this.url).pipe(map(zimmers => {
            let result = [] 
            for(var i in zimmers)
                result.push(zimmers[i]);
            return result    
        })
    )}   
}