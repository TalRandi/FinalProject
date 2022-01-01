import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Zimmer } from '../shared-data/zimmer.model'
import { Hut } from '../shared-data/hut.model'

@Component({
  selector: 'app-create-zimmer',
  templateUrl: './create-zimmer.component.html',
  styleUrls: ['./create-zimmer.component.css']
})
export class CreateZimmerComponent implements OnInit {

  @ViewChild('form') generalForm: NgForm;
  @ViewChildren('hutForm') hutForm: QueryList<NgForm>;
  
  regions = ['צפון', 'מרכז', 'איזור ירושלים', 'דרום'];
  hut_counter = [0] 
  result: string[] = [];
  zimmer: Zimmer;
  hut: Hut;
  huts:Hut[] = []

  constructor() { }

  onSubmit(){
    
    let valid_form = true
    this.huts = []

    this.hutForm.forEach((item, index) => {
      if(item.valid){
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
        this.generalForm.value.total_capacity,
        this.generalForm.value.region,
        [],
        this.huts
      )   
      console.log(this.zimmer);
      this.hutForm.reset
      this.generalForm.reset();
    }
  }
  
  ngOnInit(): void {  }

  
  onAddHut(){
    
    this.hut_counter.push(this.hut_counter[this.hut_counter.length-1]+1)
    console.log(this.hut_counter);
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



 

