import { Injectable } from '@angular/core'; 
import { AngularFireAuth } from "@angular/fire/compat/auth"; 


@Injectable({
  providedIn: 'root'
})

export class DataAuthService { 
  
  constructor(private afAuth: AngularFireAuth) { } 
  getAuth() { 
    return this.afAuth; 
  } 

  resetPasswordInit(email: string) { 
    return this.afAuth.sendPasswordResetEmail(email); 
  } 

}