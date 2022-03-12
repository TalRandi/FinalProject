import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({providedIn: 'root'})
 export class AuthGuard implements CanActivate{

    constructor(private authService: AuthenticationService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>{
            if(this.authService.token != undefined && this.authService.zimmer == 'client' && this.authService.admin == false){
                return true;
            }
            return this.router.createUrlTree(['/home']);
    }
 }