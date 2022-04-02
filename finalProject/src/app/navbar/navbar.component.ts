import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { InnerDataService } from '../shared-data/inner-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isLoggedIn = false;
  public isMenuCollapsed = true;
  constructor(public authService: AuthenticationService, public innerData: InnerDataService) { }


  ngOnInit(): void {
      this.userSub = this.authService.user.subscribe(user => {
      if(user){
        this.isLoggedIn = true;
      }
      else{
        this.isLoggedIn = false;
      }
    })
      if(this.authService.token){
        this.isLoggedIn = true;
      }
  }
  togglerClicked(event: any): void{
    console.log(event);
    
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
}
