import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from '../shared-data/data-storage.service';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  @ViewChild('form') contact_us_form: NgForm;

  constructor(private storage: DataStorageService, private router: Router) { }

  request: string[] = []

  onSubmit(){
    this.request.push(this.contact_us_form.value.firstName)
    this.request.push(this.contact_us_form.value.lastName)
    this.request.push(this.contact_us_form.value.email)
    this.request.push(this.contact_us_form.value.phone)
    this.request.push(this.contact_us_form.value.message)
    this.request.push(Math.random().toString(36).substring(2, 15))
    this.storage.storeRequest(this.request)
    this.contact_us_form.reset()
    alert("הבקשה נוצרה\nניצור קשר בהקדם!")
    this.router.navigate(['/home'])
  }

  ngOnInit(): void {
  }

}
