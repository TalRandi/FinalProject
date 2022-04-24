import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
import { InnerDataService } from '../shared-data/inner-data.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isLoggedIn = false;
  client: Client;
  points: number;
  isLoading = false
  public isMenuCollapsed = true;
  constructor(public authService: AuthenticationService, public innerData: InnerDataService, private storage: DataStorageService) { }


  ngOnInit(): void { 
    this.userSub = this.authService.user.subscribe(user => {
    if(user){
      this.isLoggedIn = true;
      setTimeout(() => {
        this.loadClient();
      }, 500); 
    }
    else{
      this.isLoggedIn = false;
    }
  })
    if(this.authService.token){
      this.isLoggedIn = true;
      this.loadClient();
    }
  }

  onZimmerSearch(zimmer_to_search: any): void{
    this.innerData.zimmer_to_search = zimmer_to_search
    this.innerData.string_subject.next(this.innerData.zimmer_to_search)
  }

  ngOnDestroy(): void {
    if(this.userSub)
      this.userSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
    this.isLoggedIn = false;
  }
  loadClient(){
    if(this.authService.zimmer == 'client' && !this.authService.admin){
      this.isLoading = true;
      if(localStorage.getItem('userData')){
        var userData = JSON.parse(localStorage.getItem('userData')!.toString());
        this.storage.getClient(userData.email).subscribe(client => {
          this.client = client;
          this.points = this.client.points;
          this.isLoading = false;
        }) 
      }
    }
  }
}
