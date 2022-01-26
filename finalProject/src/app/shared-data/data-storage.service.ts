import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({ providedIn:'root' })
export class DataStorageService {
    
    url = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/pending.json'
    url_requests = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/requests.json'
    
    constructor(private http: HttpClient, private storage: AngularFireStorage){}

    storeZimmer(zimmer: Zimmer, images: File[]){
        
        this.http.post(this.url, zimmer).subscribe(() => {
            // Uploads all zimmer's images
            for (let index = 0; index < images.length; index++) {
                let url = `/zimmer-images/${zimmer.zimmer_id}/${images[index].name}`;       
                this.storage.upload(url, images[index]);                
            }
        });
    }
    storeRequest(request: string[]){
        this.http.post(this.url_requests, request).subscribe(() => {
            console.log("Request has been successfully written to the firebase");
        })
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