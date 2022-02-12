import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStorageService } from '../shared-data/data-storage.service';
import { Zimmer } from '../shared-data/zimmer.model';
import { AuthenticationService } from './authentication.service';
import { User } from './user.model';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  @ViewChild('form') login_form: NgForm;
  isLoading = false;
  error: string = '';
  my_zimmer: Zimmer[];

  constructor(private authService: AuthenticationService, private router: Router, private storage: DataStorageService) { }

  onSubmit(){
    this.onLogin();
  }

  ngOnInit(): void {
  }

  getZimmer(result: any){
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.my_zimmer = zimmers.filter(zimmer => zimmer.email == result.email);
      if(this.my_zimmer.length == 0)
        this.storage.fetchPendingZimmers().subscribe(pending_zimmers => {
          this.my_zimmer = pending_zimmers.filter(pending_zimmer => pending_zimmer.email == result.email);
          this.adminOrUser(result);
        })
      else
        this.adminOrUser(result);  
    })
  }

  adminOrUser(result: any){
    if(this.my_zimmer.length == 0){
      this.saveToLocalStorage(result, 'admin');
    }
    else{
      this.saveToLocalStorage(result, this.my_zimmer[0]);
    }
  }

  onLogin(){
    this.isLoading = true;
    this.authService.signIn(this.login_form.value.email, this.login_form.value.password).subscribe((result: any) => {  
      this.authService.token = result.idToken;
      this.getZimmer(result);
    },
    errorRes => {
      switch(errorRes.error.error.message){
        case 'EMAIL_NOT_FOUND':
          this.error = "כתובת דואר אלטרוני לא קיימת במערכת!";
          break;

        case 'INVALID_PASSWORD':
          this.error = "הסיסמה שהזנת אינה נכונה!";
          break;

        case 'USER_DISABLED':
          this.error = "חשבון זה חסום במערכת!";
          break;
        
        default:
          console.log(errorRes.error.error.message)
      }
      this.isLoading = false;
    });
  }

  saveToLocalStorage(result:any, zimmer:any){
    const expirationDate = new Date(new Date().getTime() + +result.expiresIn * 1000);
    const user = new User(result.email, result.localId, result.idToken, expirationDate, result.email == 'harelmadmoni9@gmail.com'? true: false, zimmer);
    this.authService.zimmer = zimmer;
    this.authService.user.next(user);
    this.authService.autoLogout(+result.expiresIn * 1000);
    this.isLoading = false;
    localStorage.setItem('userData', JSON.stringify(user));
    if(user.admin){
      this.authService.admin = true;
      this.router.navigate(['/admin/pending-requests']);
    }  
    else{
      this.authService.admin = false;
      this.router.navigate([`/my-zimmer/${this.authService.zimmer.zimmer_id}`]);
    }
  }

}
