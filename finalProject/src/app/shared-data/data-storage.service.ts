import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({ providedIn:'root' })
export class DataStorageService {
    
    url = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/pending.json'
    
    constructor(private http: HttpClient, private storage: AngularFireStorage){}

    storeZimmer(zimmer: Zimmer, images: File[], zimmer_id: string){
        
        this.http.post(this.url, zimmer).subscribe(() => {
            // Uploads all zimmer's images
            for (let index = 0; index < images.length; index++) {
                this.storage.upload(`/zimmer-images/${zimmer_id}/${images[index].name}`, images[index]);                
            }
        });
    }


    fetchZimmers(){
        return this.http.get< Zimmer[]>(this.url).pipe(map(zimmers => {
            let result = [] 
            for(var i in zimmers)
                result.push(zimmers[i]);


            // this.task.task.snapshot.ref.getDownloadURL().then(downloadURL => {
            //     console.log(downloadURL);
            // });

            return result    
        })
    )}   
}