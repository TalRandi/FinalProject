import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from 'src/app/shared-data/client.model';
import { DataStorageService } from '../../shared-data/data-storage.service';
import { AuthenticationService } from './../authentication.service';
import { User } from './../user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @ViewChild('form') login_form: NgForm;
  isLoading = false;
  error: string = '';
  client: Client;

  constructor(private authService: AuthenticationService, private router: Router, private storage: DataStorageService) { }

  onSubmit(){
    this.authService.signUp(this.login_form.value.email, this.login_form.value.password).subscribe((result: any) => {
      this.client = new Client(this.login_form.value.name, this.login_form.value.email, 0, []); 
      this.isLoading = true;
      this.authService.token = result.idToken;
      let zimmer: any = 'client';  
      this.storage.storeClient(this.client);
      this.authService.admin = false;
      const expirationDate = new Date(new Date().getTime() + +result.expiresIn * 1000);
      const user = new User(result.email, result.localId, result.idToken, expirationDate, false, zimmer);
      this.authService.zimmer = zimmer;
      this.authService.user.next(user);
      this.authService.autoLogout(+result.expiresIn * 1000);
      this.isLoading = false;
      localStorage.setItem('userData', JSON.stringify(user));
      this.router.navigate(['/home']);
    },
    errorRes => {
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          this.error = "כתובת דואר האלקטרוני כבר קיימת במערכת!";
          break; 

        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          this.error = "יותר מידי נסיונות רישום, נסה שוב מאוחר יותר!";
          break; 
              
        default:
          console.log(errorRes.error.error.message);  
      }  
    });
  }
  ngOnInit(): void {
  }
}

