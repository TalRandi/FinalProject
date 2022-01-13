import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Zimmer } from '../shared-data/zimmer.model'
import { Hut } from '../shared-data/hut.model'
import { DataStorageService } from '../shared-data/data-storage.service';  


@Component({
  selector: 'app-create-zimmer',
  templateUrl: './create-zimmer.component.html',
  styleUrls: ['./create-zimmer.component.css']
})
export class CreateZimmerComponent implements OnInit {

  @ViewChild('form') generalForm: NgForm;
  @ViewChildren('hutForm') hutForm: QueryList<NgForm>;
  
  regions = ['צפון', 'מרכז', 'ירושלים והסביבה', 'דרום'];
  hut_counter = [0] 
  result: string[] = [];
  zimmer: Zimmer;
  hut: Hut;
  huts:Hut[] = []
  images: File[] = [];

  constructor(private storage: DataStorageService) { }

  onSubmit(){
    
    let valid_form = true
    this.huts = []
    let total_capacity = 0
    let min_price_regular = Number.MAX_SAFE_INTEGER, min_price_weekend = Number.MAX_SAFE_INTEGER
    
    this.hutForm.forEach((item, index) => {
      if(item.valid){
        if(item.value.regularPrice < min_price_regular)
          min_price_regular = item.value.regularPrice
        if(item.value.weekendPrice < min_price_weekend)
          min_price_weekend = item.value.weekendPrice
        total_capacity += item.value.capacity
        this.submitHut(item.value)
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
        min_price_regular,
        min_price_weekend,
        this.generalForm.value.region,
        this.huts
      )   
      console.log(this.zimmer);
      this.hutForm.forEach(item => {
        item.reset()
      })
      this.generalForm.reset();
      this.storage.storeZimmer(this.zimmer, this.images)
    }
  }
  onSelect(event: any) {
    this.images.push(...event.addedFiles);
  }
  onRemove(event: any) {
    this.images.splice(this.images.indexOf(event), 1);
  }

  
  ngOnInit(): void {  }

  
  onAddHut(){
    
    this.hut_counter.push(this.hut_counter[this.hut_counter.length-1]+1)
  }

  onDeleteHut(index: number){
    this.hut_counter.splice(index, 1)
  }

  private submitHut(item: Hut){

    this.hut = new Hut(
      item.hutName,
      item.capacity,
      item.regularPrice,
      item.weekendPrice,
      item.jacuzzi,
      item.pool,
      []
    )
    this.huts.push(this.hut) 
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
}



 

