import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { map, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from "../authentication/authentication.service";

@Injectable({ providedIn:'root' })
export class DataStorageService{
    
    url_pending = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/pending.json'
    url_requests = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/requests.json'
    url_accepted = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/accepted.json'
    
    constructor(private http: HttpClient, private storage: AngularFireStorage, private authService: AuthenticationService){}

    storePendingZimmer(zimmer: Zimmer, images: File[]){
        
        this.http.post(this.url_pending, zimmer).subscribe(() => {
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

    fetchPendingZimmers(){
        //   if(this.authService.token)
        //     console.log(this.authService.token);   
  
        return this.http.get<Zimmer[]>(this.url_pending, {params: new HttpParams().set('auth', this.authService.token)})
        .pipe(map(zimmers => {
            let result = [] 
            for(var id in zimmers)
                result.push(zimmers[id]);
            return result    
        })
    )}

    fetchAcceptedZimmers(){
        return this.http.get<Zimmer[]>(this.url_accepted).pipe(map(zimmers => {
            let result = [] 
            for(var id in zimmers)
                result.push(zimmers[id]);
            return result    
        })
    )}

    fetchRequests(){
        return this.http.get<string[]>(this.url_requests, {params: new HttpParams().set('auth', this.authService.token)})
        .pipe(map(requests => {
            let result = [] 
            for(var id in requests)
                result.push(requests[id]);
            return result
        }))
    }
    
    storeAcceptedZimmer(zimmer: Zimmer){
        return this.http.post(this.url_accepted, zimmer).pipe(tap(() => {
            this.http.get<Zimmer[]>(this.url_pending).pipe(map(zimmers => {
                for(var id in zimmers)
                    if(zimmers[id].zimmer_id == zimmer.zimmer_id){
                        delete zimmers[id];
                        this.http.put(this.url_pending, zimmers).subscribe(); 
                        break  
                    }                    
            })).subscribe()
        }) 
    )}
    approveRequest(request: string){
        return this.http.get<string[]>(this.url_requests).pipe(map(requests => {
            for(var id in requests)
                if(requests[id][5] == request[5]){
                    delete requests[id];
                    this.http.put(this.url_requests, requests).subscribe();
                    break
                }
        }))
    }
}