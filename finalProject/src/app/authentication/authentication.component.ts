import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  onSubmit(){
    // this.authService.signUp(this.login_form.value.email).subscribe(result => {
    //   console.log(result);
    //   const expirationDate = new Date(new Date().getTime() + +result.expiresIn * 1000);
    //   const user = new User(result.email, result.localId, result.idToken, expirationDate)
    //   this.authService.user.next(user);
    //   this.isLoading = false;  
    // },
    // errorRes => {
    //   switch(errorRes.error.error.message){
    //     case 'EMAIL_EXISTS':
    //       this.error = "כתובת דואר האלקטרוני כבר קיימת במערכת!";
    //       break;

    //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
    //       this.error = "יותר מידי נסיונות התחברות, נסה שוב מאוחר יותר!";
    //       break;
        
    //     default:
    //       console.log(errorRes.error.error.message)
    //   }
    //   this.isLoading = false;
    // });


    this.isLoading = true;
    this.authService.signIn(this.login_form.value.email, this.login_form.value.password).subscribe((result: any) => {
      const expirationDate = new Date(new Date().getTime() + +result.expiresIn * 1000);
      const user = new User(result.email, result.localId, result.idToken, expirationDate)
      this.authService.token = result.idToken;
      this.authService.user.next(user);
      this.authService.autoLogout(+result.expiresIn * 1000);
      this.isLoading = false;
      localStorage.setItem('userData', JSON.stringify(user));  
      this.router.navigate(['./pending-zimmers'], {relativeTo: this.route})
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

  ngOnInit(): void {
  }

}
