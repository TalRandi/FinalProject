import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({ providedIn:'root' })
export class DataStorageService {
    
    // url = 'https://bnb-israel-99206-default-rtdb.europe-west1.firebasedatabase.app/zimmers.json'
    url = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/pending.json'
    
    
    constructor(private http: HttpClient, private storage: AngularFireStorage){}

    storeZimmer(zimmer: Zimmer, images: File[]){
        this.http.post(this.url, zimmer).subscribe((item: any) => {
            alert("Success data"); 
            const task = this.storage.upload('test', images[0]);
        }); 
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