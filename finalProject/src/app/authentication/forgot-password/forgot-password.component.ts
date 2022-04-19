import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataAuthService } from 'src/app/shared-data/data-auth.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild('form') forgot_password_form: NgForm;
  isLoading = false;
  error: string = ""

  constructor(private fireAuth: DataAuthService, private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit(): void{

    this.isLoading = true
    this.error = ""
    let email = this.forgot_password_form.value.email
    this.fireAuth.resetPasswordInit(email).then(() => {
      alert("נשלח קישור לכתובת המייל ובו אפשרות לאפס את הסיסמא")
      this.router.navigate(['/login-page']);
      this.isLoading = false
    }).catch((e) => {
      this.error = "המשתמש אינו קיים במערכת!"
      this.isLoading = false
    })
  }

}
