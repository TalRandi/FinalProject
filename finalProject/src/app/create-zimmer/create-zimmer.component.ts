import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Zimmer } from '../shared-data/zimmer.model'
import { Hut } from '../shared-data/hut.model'
import { DataStorageService } from '../shared-data/data-storage.service';
import { Router } from '@angular/router';  
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../authentication/user.model';


@Component({
  selector: 'app-create-zimmer',
  templateUrl: './create-zimmer.component.html',
  styleUrls: ['./create-zimmer.component.css']
})
export class CreateZimmerComponent implements OnInit {

  @ViewChild('form') generalForm: NgForm;
  @ViewChildren('hutForm') hutForm: QueryList<NgForm>;
  isLoading = false;
  error: string = '';
  
  regions = ['צפון', 'מרכז', 'ירושלים והסביבה', 'דרום'];
  hut_counter = [0] 
  result: string[] = [];
  zimmer: Zimmer;
  hut: Hut;
  huts:Hut[] = []
  images: File[] = [];
  hutImages: File[][] = [];
  features: string[] = [];

  constructor(private storage: DataStorageService, private router: Router, private authService: AuthenticationService ) { }

  onSubmit(){
    this.onSignUp();
  }

  private CreateZimmer(result: any){
    let valid_form = true
    this.huts = []
    let total_capacity = 0
    let min_price_regular = Number.MAX_SAFE_INTEGER, min_price_weekend = Number.MAX_SAFE_INTEGER
    let zimmer_id = Math.random().toString(36).substring(2, 15);
    
    this.hutForm.forEach((item, index) => {
      if(item.valid){
        if(item.value.regularPriceTwoNights < min_price_regular)
          min_price_regular = item.value.regularPriceTwoNights
        if(item.value.weekendPriceTwoNights < min_price_weekend)
          min_price_weekend = item.value.weekendPriceTwoNights
        total_capacity += item.value.capacity
        this.fillFeatures(item.value)
        this.submitHut(item.value, zimmer_id, index)
      }
      else{
        console.log("Form number "+ (index+1) +" is invalid");
        valid_form = false
        return
      }
    })
    if(valid_form){
      this.zimmer = new Zimmer(
        this.generalForm.value.ownerName,
        this.generalForm.value.phone,
        this.generalForm.value.zimmerName,
        this.generalForm.value.email,
        this.generalForm.value.generalDescription,
        total_capacity,
        "pending",
        min_price_regular,
        min_price_weekend,
        this.generalForm.value.region,
        zimmer_id,
        this.features,
        this.huts,
        []
      )    
      this.storeImagesUrl(this.zimmer, this.images);
      this.storage.storePendingZimmer(this.zimmer, this.images, this.hutImages);
      this.authService.zimmer = this.zimmer;
      const expirationDate = new Date(new Date().getTime() + +result.expiresIn * 1000);
      const user = new User(result.email, result.localId, result.idToken, expirationDate, false, this.authService.zimmer);
      this.authService.token = result.idToken;
      this.authService.user.next(user);
      this.authService.autoLogout(+result.expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
      this.authService.admin = false;
      this.router.navigate([`/my-zimmer/${zimmer_id}`]);
    }
  }

  onSelect(event: any) {
    this.images.push(...event.addedFiles);
  }
  onSelectHut(event: any, index: number){
    if(this.hutImages[index] == undefined)
      this.hutImages[index] = []
    this.hutImages[index].push(...event.addedFiles);
  }
  onRemove(event: any) {
    this.images.splice(this.images.indexOf(event), 1);
  }
  onRemoveHut(event: any, index: number) {
    this.hutImages[index].splice(this.hutImages[index].indexOf(event), 1);
  }
   
  ngOnInit(): void {  }

  onAddHut(){
    this.hut_counter.push(this.hut_counter[this.hut_counter.length-1]+1)  
  }

  onDeleteHut(index: number){
    this.hut_counter.splice(index, 1)
  }

  private submitHut(item: Hut, zimmer_id: string, index: number){

    this.hut = new Hut(
      item.hutName,
      item.capacity,
      item.regularPrice,
      item.weekendPrice,
      item.regularPriceTwoNights,
      item.weekendPriceTwoNights,
      item.jacuzzi,
      item.pool,
      item.heated_pool,
      item.indoor_pool,
      item.air_conditioner,
      item.wifi,
      item.sauna,
      item.parking
    )
    this.storeHutImagesUrl(zimmer_id, this.hut, item.hutName, this.hutImages[index])
    this.huts.push(this.hut) 
  }
  private fillFeatures(item: Hut){
    if(item.jacuzzi && !this.features.includes("jacuzzi"))
      this.features.push("jacuzzi")
    if(item.pool && !this.features.includes("pool"))
      this.features.push("pool")
    if(item.heated_pool && !this.features.includes("heated_pool"))
      this.features.push("heated_pool")
    if(item.indoor_pool && !this.features.includes("indoor_pool"))
      this.features.push("indoor_pool")
    if(item.air_conditioner && !this.features.includes("air_conditioner"))
      this.features.push("air_conditioner")
    if(item.wifi && !this.features.includes("wifi"))
      this.features.push("wifi")
    if(item.sauna && !this.features.includes("sauna"))
      this.features.push("sauna")
    if(item.parking && !this.features.includes("parking"))
      this.features.push("parking")
  }

  hutValidator(){
    
    let isInvalidHut = false
    if(this.hutForm){
      this.hutForm.forEach(hut => {
        if(hut.invalid){
          isInvalidHut = true
          return
        }
      })
    }
    return isInvalidHut
  }
  storeImagesUrl(zimmer: Zimmer, images: File[]){
    for (let index = 0; index < images.length; index++) {
      let url = `/zimmer-images/${zimmer.zimmer_id}/${images[index].name}`;
      zimmer.images.push(url)             
    }
  }
  storeHutImagesUrl(zimmer_id: string, hut: Hut, hut_name: string, hutImages: File[]){
    for (let index = 0; index < hutImages.length; index++) {
      let url = `/zimmer-images/${zimmer_id}/${hut_name}/${hutImages[index].name}`;
      hut.images.push(url)             
    }
  }
  onSignUp(){
    this.authService.signUp(this.generalForm.value.email, this.generalForm.value.password).subscribe((result: any) => {
      this.isLoading = true;
      this.CreateZimmer(result);
      this.isLoading = false;
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
}
