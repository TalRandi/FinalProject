import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
import { Zimmer } from '../shared-data/zimmer.model';

@Component({
  selector: 'app-client-favorites',
  templateUrl: './client-favorites.component.html',
  styleUrls: ['./client-favorites.component.css']
})
export class ClientFavoritesComponent implements OnInit {

  isLoading = false;
  client: Client;

  constructor(private storage: DataStorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    var userData = JSON.parse(localStorage.getItem('userData')!.toString());
    this.storage.getClient(userData.email).subscribe(client => {
      this.client = client;
      if(!this.client.favorites){
        this.client.favorites = [];
      }
      this.isLoading = false;
    }) 
  }
  zimmer_clicked(zimmer: Zimmer): void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/home/${zimmer.zimmer_id}`])
    );
  
    window.open(url, '_blank');
  }

  removeFavorite(favoriteZimmer: Zimmer){
    
    this.client.favorites = this.client.favorites.filter(zimmer => zimmer.zimmer_id != favoriteZimmer.zimmer_id)

    this.storage.updateClient(this.client).subscribe();
  }

}
