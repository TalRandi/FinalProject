import { Injectable, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({providedIn: 'root'})
 export class AuthGuardId implements CanActivate{

    constructor(private authService: AuthenticationService, private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>{
        const id = route.params.id;
        if(this.authService.token != undefined && id == this.authService.zimmer.zimmer_id){
            return true;
        }
        return this.router.createUrlTree(['/home']);
            
    }
 }