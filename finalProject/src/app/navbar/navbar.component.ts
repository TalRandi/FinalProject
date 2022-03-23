import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isLoggedIn = false;
  public isMenuCollapsed = true;
  constructor(public authService: AuthenticationService) { }

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

  ngOnDestroy(): void {
    if(this.userSub)
      this.userSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
