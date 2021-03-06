import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Zimmer } from "./zimmer.model";
import { map, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthenticationService } from "../authentication/authentication.service";
import { Client } from "./client.model";

@Injectable({ providedIn:'root' })
export class DataStorageService{
    
    url_pending = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/pending.json';
    url_requests = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/requests.json';
    url_accepted = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/accepted.json';
    url_requests_archive = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/requests-archive.json';
    url_clients = 'https://goeasy-5d966-default-rtdb.europe-west1.firebasedatabase.app/clients.json';
    
    constructor(private http: HttpClient, private storage: AngularFireStorage, private authService: AuthenticationService){}

    storePendingZimmer(zimmer: Zimmer, images: File[], hutImages: File[][]){
        
        this.http.post(this.url_pending, zimmer).subscribe(() => {
            // Uploads all zimmer's images
            for (let index = 0; index < images.length; index++) {
                let url = `/zimmer-images/${zimmer.zimmer_id}/${images[index].name}`;       
                this.storage.upload(url, images[index]);               
            }
            for (let hut_index = 0; hut_index < zimmer.huts.length; hut_index++) {
                for (let index = 0; index < hutImages[hut_index].length; index++) {  
                    let url = `/zimmer-images/${zimmer.zimmer_id}/${zimmer.huts[hut_index].hutName}/${hutImages[hut_index][index].name}`;    
                    this.storage.upload(url, hutImages[hut_index][index]);                
                }
            }
        });
    }

    storeRequest(request: string[]){
        this.http.post(this.url_requests, request).subscribe();
    }

    fetchPendingZimmers(){   
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

    fetchArchivedRequests(){
        return this.http.get<string[]>(this.url_requests_archive, {params: new HttpParams().set('auth', this.authService.token)})
        .pipe(map(requests => {
            let result = [] 
            for(var id in requests)
                result.push(requests[id]);
            return result
        }))  
    }

    storeArchivedRequest(request: string){
        this.http.post(this.url_requests_archive, request).subscribe();
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
    storeEditedZimmer(zimmer: Zimmer){
        return this.http.get<Zimmer[]>(this.url_accepted).pipe(map(zimmers => {
            for(var id in zimmers)
                if(zimmers[id].zimmer_id == zimmer.zimmer_id){
                    zimmer.orders = zimmers[id].orders;
                    zimmer.rate = zimmers[id].rate;
                    zimmer.reviews = zimmers[id].reviews;
                    for(var hut of zimmer.huts){
                        let filtered_hut = zimmers[id].huts.filter(hut_item => hut.hutName == hut_item.hutName)
                        if(filtered_hut.length > 0)
                           hut.events = filtered_hut[0].events 
                    }  
                    delete zimmers[id];
                    this.http.put(this.url_accepted, zimmers).subscribe(() => {
                        this.storeAcceptedZimmer(zimmer).subscribe();
                    });
                    break; 
                }  
        }))
    }
    rejectZimmer(zimmer: Zimmer){
        return this.http.get<Zimmer[]>(this.url_pending).pipe(map(zimmers => {
            for(var id in zimmers)
                if(zimmers[id].zimmer_id == zimmer.zimmer_id){
                    delete zimmers[id];
                    this.http.put(this.url_pending, zimmers).subscribe(() => {
                        this.http.post(this.url_pending, zimmer).subscribe();
                    });
                    break; 
                } 
        }))
    }
    approveRequest(request: string){
        return this.http.get<string[]>(this.url_requests).pipe(map(requests => {
            for(var id in requests)
                if(requests[id][5] == request[5]){
                    this.storeArchivedRequest(request);
                    delete requests[id];
                    this.http.put(this.url_requests, requests).subscribe();
                    break
                }
        }))
    }
    updateZimmer(zimmer:Zimmer){
        return this.http.get<Zimmer[]>(this.url_accepted).pipe(map(zimmers => {
            for(var id in zimmers)
                if(zimmers[id].zimmer_id == zimmer.zimmer_id){
                    delete zimmers[id];
                    this.http.put(this.url_accepted, zimmers).subscribe(() => {
                        this.http.post(this.url_accepted, zimmer).subscribe()
                    });
                    break
                }
        }))
    }
    setApproveOnBoth(zimmer:Zimmer, order_id: string){
        this.updateZimmer(zimmer).subscribe(() => {
            this.http.get<Client[]>(this.url_clients).pipe(map(clients => {
                for(var id in clients)
                    clients[id].orders.forEach(order => {
                        if(order.order_id == order_id){
                            order.isApproved = true;
                            let client = clients[id];
                            delete clients[id];
                            this.http.put(this.url_clients, clients).subscribe(() => {
                                this.http.post(this.url_clients, client).subscribe();
                            })
                            return;
                        }
                    })
            })).subscribe();
        })
    }
    cancelOrderOnBoth(order_id: string, points: number, rate_penalty=-1){
        this.http.get<Zimmer[]>(this.url_accepted).pipe(map(zimmers => {
            for(var id in zimmers){
                if(zimmers[id].orders){
                    let filtered_orders = zimmers[id].orders.filter(order => order.order_id != order_id);
                    let order_to_remove = zimmers[id].orders.filter(order => order.order_id == order_id);
                    
                    if(order_to_remove[0]){
                        let filtered_hut = zimmers[id].huts.filter(hut_item => order_to_remove[0].hut_name == hut_item.hutName)
                        if(filtered_hut.length > 0){
                            filtered_hut[0].events = filtered_hut[0].events.filter(event => event.id != order_to_remove[0].order_id)
                        }
                    }
                    if(filtered_orders.length != zimmers[id].orders.length){
                        let zimmer = zimmers[id];
                        zimmer.orders = filtered_orders;
                        if(rate_penalty != -1){
                            zimmer.rate = zimmer.rate - rate_penalty;
                        }
                        delete zimmers[id];
                        this.http.put(this.url_accepted, zimmers).subscribe(() => {
                            this.http.post(this.url_accepted, zimmer).subscribe();
                        })
                        break; 
                    }
                }
            }
        })).subscribe();
        this.http.get<Client[]>(this.url_clients).pipe(map(clients => {
            for(var id in clients){
                if(clients[id].orders){
                    let filtered_orders = clients[id].orders.filter(order => order.order_id != order_id);
                    if(filtered_orders.length != clients[id].orders.length){
                        let client = clients[id];
                        client.points += points
                        client.orders = filtered_orders;
                        delete clients[id];
                        this.http.put(this.url_clients, clients).subscribe(() => {
                            this.http.post(this.url_clients, client).subscribe();
                        })
                        break; 
                    }
                }
            }
        })).subscribe();    
    }
    setRatedOnBoth(client:Client, order_id: string, client_rate: number, review : any = ""){
        this.updateClient(client).subscribe(() => {
            this.http.get<Zimmer[]>(this.url_accepted).pipe(map(zimmers => {
                for(var id in zimmers){
                    if(zimmers[id].orders)
                        zimmers[id].orders.forEach(order => {
                            if(order.order_id == order_id){
                                order.isRated = true;
                                let zimmer = zimmers[id];
                                console.log(zimmer.reviews);
                                console.log(review);
                                if(review != ""){
                                    console.log(zimmer.reviews);
                                    if(zimmer.reviews){
                                        zimmer.reviews.push(review)
                                    }
                                    else{
                                        zimmer.reviews = [review]
                                    }
                                }
                                zimmer.rate = zimmer.rate * 0.9 + client_rate * 0.1;
                                delete zimmers[id];
                                this.http.put(this.url_accepted, zimmers).subscribe(() => {
                                    this.http.post(this.url_accepted, zimmer).subscribe();
                                })
                                return;
                            }
                        })
                }    
            })).subscribe();
        })
        
    }
    updateClient(client:Client){   
        return this.http.get<Client[]>(this.url_clients).pipe(map(clients => {
            for(var id in clients)
                if(clients[id].email == client.email){
                    delete clients[id];
                    this.http.put(this.url_clients, clients).subscribe(() => {
                        this.http.post(this.url_clients, client).subscribe()
                    });
                }
        }))
    }

    storeClient(client: Client){
        this.http.post(this.url_clients, client).subscribe();
    }
    getClient(email: string){
        return this.http.get(this.url_clients).pipe(map((clients: any) => {
           for(var id in clients)
            if(clients[id].email == email){
                return clients[id] 
            }
        })
    )}
    deleteEditZimmer(zimmer: Zimmer){
        return this.http.get<Zimmer[]>(this.url_pending).pipe(map(zimmers => {
            for(var id in zimmers)
                if(zimmers[id].zimmer_id == zimmer.zimmer_id){
                    delete zimmers[id];
                    this.http.put(this.url_pending, zimmers).subscribe();
                    break
                }
        }))
    }
    getImage(url: string){
        return this.storage.ref(url).getDownloadURL().pipe(map(image_url => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', image_url);
            xhr.send();
            return xhr;
        }));
     
    }
    deleteImage(url: string){
        return this.storage.ref(url).delete();
    }
}