import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-my-zimmer',
  templateUrl: './my-zimmer.component.html',
  styleUrls: ['./my-zimmer.component.css']
})
export class MyZimmerComponent implements OnInit {

  @ViewChild('form') generalForm: NgForm;
  @ViewChildren('hutForm') hutForm: QueryList<NgForm>;
  
  isLoading = false;
  selectedIndex = 0;
  regions = ['צפון', 'מרכז', 'ירושלים והסביבה', 'דרום'];
  my_zimmer: Zimmer[];
  my_pending_zimmer: Zimmer[];
  edit_mode = false; 
  images: File[] = [];
  zimmer: Zimmer;
  hut: Hut;
  huts:Hut[] = []
  hutImages: File[][] = [];
  hut_counter: number[];
  zimmer_to_display:Zimmer;
  features: string[] = [];
  constructor(private storage: DataStorageService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      if(zimmers)
        this.my_zimmer = zimmers.filter(zimmer => zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
        this.zimmer_to_display = this.my_zimmer[0]    
      this.storage.fetchPendingZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(pending_zimmers => {
        if(pending_zimmers)
          this.my_pending_zimmer = pending_zimmers.filter(pending_zimmer => pending_zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
          if(this.my_pending_zimmer.length > 0)
            this.zimmer_to_display = this.my_pending_zimmer[0];
      }) 
    })
  }
  onZimmerEdit(){
    this.hut_counter = [...Array(this.zimmer_to_display.huts.length).keys()];
    this.zimmer_to_display.images.forEach(image_url => {
      this.storage.getImage(image_url).subscribe(request => {       
        request.onload = () => {
          let image_name = image_url.split("/").pop()
          let file = new File([request.response], image_name? image_name: "Untitled", {type: "image/jpg"})
          this.images.push(file)
        }; 
      });
    })
    this.zimmer_to_display.huts.forEach((hut, index) => {
      hut.images.forEach(hut_image_url => { 
        this.storage.getImage(hut_image_url).subscribe(request => {
          request.onload = () => {
            if(this.hutImages[index] == undefined)
              this.hutImages[index] = []
            let image_name = hut_image_url.split("/").pop()
            let file = new File([request.response], image_name? image_name: "Untitled", {type: "image/jpg"})  
            this.hutImages[index].push(file)
          }; 
        })
      })
    })
    this.edit_mode = true;
    this.selectedIndex = 2;
  }
  onZimmerDelete(){
    this.isLoading = true;
    this.storage.deleteEditZimmer(this.my_pending_zimmer[0]).subscribe(() => {
      this.ngOnInit();
    })
  }
  onSelect(event: any) {
    this.images.push(...event.addedFiles);
  }
  onSelectHut(event: any, index: number){
    if(this.hutImages[index] == undefined)
      this.hutImages[index] = []
    this.hutImages[index].push(...event.addedFiles);
  }
  onAddHut(){
    this.hut_counter.push(this.hut_counter[this.hut_counter.length-1]+1)   
  }
  onDeleteHut(index: number){
    this.hut_counter.splice(index, 1)
  }
  onRemove(event: any) {
    this.images.splice(this.images.indexOf(event), 1);
  }
  onRemoveHut(event: any, index: number) {
    this.hutImages[index].splice(this.hutImages[index].indexOf(event), 1);
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
  onSubmit(){
    this.isLoading = true;
    let valid_form = true;
    this.huts = [];
    let total_capacity = 0;
    let min_price_regular = Number.MAX_SAFE_INTEGER, min_price_weekend = Number.MAX_SAFE_INTEGER;
    let zimmer_id = this.zimmer_to_display.zimmer_id;
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
        this.zimmer_to_display.email,
        this.generalForm.value.generalDescription,
        total_capacity,
        this.zimmer_to_display.status == 'pending_rejected'? 'pending' : 'accepted',
        min_price_regular,
        min_price_weekend,
        this.generalForm.value.region,
        4,
        zimmer_id,
        this.features,
        this.huts,
        []
      )
      this.storeImagesUrl(this.zimmer, this.images);
      this.storage.deleteEditZimmer(this.zimmer).subscribe(() => {
        this.storage.storePendingZimmer(this.zimmer, this.images, this.hutImages);
        this.edit_mode = false;
        this.selectedIndex = 1;
        this.ngOnInit();
      })
    }
  }
}
