import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { User } from "./user.model";

@Injectable({providedIn: 'root'})
export class AuthenticationService{

    user = new Subject<User>();
    token: any;
    admin: boolean;
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string){
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAzXE1iyj6-BjGD8lrvE7Zt6wYBTTKRFoc';
        let user = {
            email: email,
            password: "123456",
            // password: Math.random().toString(36).substring(2, 13),
            returnSecureToken: true,
        }
        return this.http.post(url, user);
    }

    signIn(email: string, password: string){
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAzXE1iyj6-BjGD8lrvE7Zt6wYBTTKRFoc';
        let user = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        return this.http.post(url, user);
    }

    autoLogin(){
        if(localStorage.getItem('userData'))
            var userData = JSON.parse(localStorage.getItem('userData')!.toString());
        if(!userData){
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate), userData.email == 'harelmadmoni9@gmail.com'? true: false);
        
        if(loadedUser.token){ 
            this.token = userData._token;
            this.admin = userData.admin;
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            alert("הנך עומד להתנתק, אנא התחבר מחדש")
            this.logout();
        }, expirationDuration)
    }

    logout(){
        this.user.next(undefined);
        this.token = undefined;
        this.admin = false;
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;    
        this.router.navigate(["/home"]).then(() => window.location.reload());
    }
}