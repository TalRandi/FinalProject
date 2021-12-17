import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-zimmer',
  templateUrl: './create-zimmer.component.html',
  styleUrls: ['./create-zimmer.component.css']
})
export class CreateZimmerComponent implements OnInit {

  @ViewChild('form') myForm: NgForm;
  regions = ['צפון', 'מרכז', 'איזור ירושלים', 'דרום'];
  submitted = false;

  user = {
    email:"",
    region:"",
    password:""
  }

  onSubmit(){
    this.user.email = this.myForm.value.email;
    this.user.region = this.myForm.value.region;
    this.user.password = this.myForm.value.password;
    this.submitted = true;
    this.myForm.reset();
  }
  constructor() { }

  ngOnInit(): void {
  }

}



 

