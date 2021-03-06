import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Order } from 'src/app/shared-data/order.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';
import { Client } from 'src/app/shared-data/client.model';
import { InnerDataService } from '../../shared-data/inner-data.service';
import { EmailService } from 'src/app/shared-data/email.service';
import { finalize } from 'rxjs/operators';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { addDays, parseISO } from 'date-fns';


@Component({
  selector: 'app-zimmer-details',
  templateUrl: './zimmer-details.component.html',
  styleUrls: ['./zimmer-details.component.css']
})

export class ZimmerDetailsComponent implements OnInit {

  @ViewChildren('form') form: QueryList<NgForm>;
  @ViewChildren('dateRangeStart') dateStart: QueryList<ElementRef>;
  @ViewChildren('dateRangeEnd') dateEnd: QueryList<ElementRef>;
  @ViewChildren('hutDates') hutDates: QueryList<MatDateRangeInput<Date>>;

  isLoading = false;
  zimmer_id: string;
  zimmer: Zimmer;
  client: Client;
  startDate = "";
  endDate = "";
  edit = false;
  points: number = 0;
  points_to_use: number = 0;
  address_lat: number;
  address_lng: number;
  disabled_dates: string[] = [];
  invalidDate: boolean[] = []

  onOpenDatePicker(hut: Hut, index: number){
    this.disabled_dates = [];
    if(hut.events){
      hut.events.forEach(event => {
        let temp_date = parseISO(event.start.toString());
        let start = parseISO(event.start.toString()).toLocaleDateString()
        let end = parseISO(event.end ? event.end.toString() : "").toLocaleDateString()
        let temp_string = start;
        while(temp_string != end){
          if(!this.disabled_dates.includes(temp_string)){
            this.disabled_dates.push(temp_string);
          }
          temp_date = addDays(temp_date, 1);
          temp_string = temp_date.toLocaleDateString();   
        }  
      })            
      this.hutDates.get(index)!.dateFilter = this.rangeFilter.bind(this);
    }
  }

  rangeFilter(date: Date | null){
    if(!date){
      return false
    }
    return this.disabled_dates?.indexOf(date!.toLocaleDateString()) == -1;
  };

  minDate = new Date();

  constructor(private storage: DataStorageService, private router: Router, 
              public authService: AuthenticationService, private _snackBar: MatSnackBar, 
              public innerData: InnerDataService, private emailService: EmailService,) { }

  
  ngOnInit(): void {
    this.isLoading = true
    this.zimmer_id = this.router.url.split('/').pop()!

    if(localStorage.getItem('Query')){
      var dates_from_local = JSON.parse(localStorage.getItem('Query')!.toString());
      this.startDate = dates_from_local.start
      this.endDate = dates_from_local.end
    }

    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.zimmer = zimmers.filter(zimmer => { return zimmer.zimmer_id == this.zimmer_id })[0]
      if(this.zimmer){
        this.setLngLat()
        this.isLoading = false

        for (let index = 0; index < this.zimmer.huts.length; index++) {
          this.invalidDate[index] = false         
        }
      }
            
      if(this.zimmer === undefined && !this.authService.admin){
        this.router.navigate(['/not-found']);
      }
      else if(this.zimmer === undefined && this.authService.admin){
        this.storage.fetchPendingZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(zimmers => {
          this.zimmer = zimmers.filter(zimmer => { return zimmer.zimmer_id == this.zimmer_id })[0]
          this.setLngLat();
        })
      }
      if(this.authService.zimmer == 'client' && !this.authService.admin){
        var userData = JSON.parse(localStorage.getItem('userData')!.toString());
        this.storage.getClient(userData.email).subscribe(client => {
          this.client = client;
          this.points = this.client.points
        })
      }
    })
 
  }

  dateRangeChange(start: string, end: string, hut_index: number){
    
    this.invalidDate[hut_index] = false
    
    let desired_start = new Date(this.formatDate(start))
    let desired_end = new Date(this.formatDate(end))
    
    const d_date = new Date(desired_start.getTime());

    d_date.setDate(d_date.getDate() + 1);
  
    const desired_between = [desired_start.toLocaleDateString()];
  
    while(d_date < desired_end) {
      desired_between.push(new Date(d_date).toLocaleDateString());
      d_date.setDate(d_date.getDate() + 1);
    }
    
    let intersection = this.disabled_dates.filter((date: string) => desired_between.includes(date))

    if(intersection.length > 0)
      this.invalidDate[hut_index] = true

  }


  formatDate(date: string){
    if(date == "") return ""

    let res = date.split('.');
    let temp = res[2]
    res[2] = res[0]
    res[0] = temp

    if(res[1].length < 2)
      res[1] = '0'+res[1]

    if(res[2].length < 2)
      res[2] = '0'+res[2]

    return res[0]+'/'+res[1]+'/'+res[2]
  }

  onOrderSubmition(hut: Hut, index: number){

    let start = this.dateStart.get(index)?.nativeElement.value
    let end = this.dateEnd.get(index)?.nativeElement.value

    let order = new Order(
      this.zimmer.zimmerName,
      this.zimmer.email,
      this.form.get(index)?.form.value.name,
      this.form.get(index)?.form.value.phone,
      this.form.get(index)?.form.value.email,
      start,
      end,
      this.form.get(index)?.form.value.special_requests,
      hut.hutName,
      this.form.get(index)?.form.value.number_of_guests,
      Math.random().toString(36).substring(2, 10),
      false,
      false,
      this.calculatePricing(start, end, hut)[2],
      this.points_to_use
    ) 

    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.zimmer = zimmers.filter(zimmer => {
        return zimmer.zimmer_id == this.zimmer_id
      })[0]
      if(this.zimmer.orders){
        this.zimmer.orders.push(order)
      }
      else{
        this.zimmer.orders = [order]
      }
      this.storage.updateZimmer(this.zimmer).subscribe(() => {
        if(localStorage.getItem('userData')){
          var userData = JSON.parse(localStorage.getItem('userData')!.toString());
          if(userData.zimmer == 'client' && userData.admin == false){
            this.storage.getClient(userData.email).subscribe(client => {
              this.client = client;
              if(!this.client.orders){
                this.client.orders = [];
              }
              this.client.points -= this.points_to_use
  
              this.client.orders.push(order);
              this.storage.updateClient(this.client).subscribe();
            })
          }
        }
      })

    })

    let header = this.zimmer.ownerName + ", ???????? ???? "
    let line1 = "!???????????? ?????????? ????????"
    let line2 = "?????????? - " + order.zimmerName
    let line3 =  "???????????? - " + hut.hutName
    let line4 = "???????????? - " + order.start_date + " ?????? ???????????? - " + order.end_date
    let line5 = "???????? ????????????: " + order.guests
    let line6 = " ???? ?????????? - " + order.name
    let line7 = "???????? ???????????? - " + order.phone
    let line8 = "?????????? ?????????????? - "
    line8 += (order.requests ? order.requests: "??????")
    let line9 = "?????????? ???????????? ?????????? ?????????????? ???????? ?????? ?????????????? - ?????????????? ??????"
    
    this.emailService.sendLongEmail(header, this.zimmer.email, line1, line2, line3, line4, line5,
                                   line6, line7, line8, line9, "GoEasy")
    
    this._snackBar.open("?????????? ????????????, ?????????? ???????? ?????? ?????????? ???????? ????????.", "??????????", {
      duration: 10000,
      panelClass: ['my-snackbar', 'login-snackbar'],
     });
  }

  setLngLat(){
    if(this.zimmer.address.geometry) {
      this.address_lat = +this.zimmer.address.geometry.location.lat      
      this.address_lng = +this.zimmer.address.geometry.location.lng
    }
  }

  calculatePricing(start: string, end: string, hut: Hut){

    let start_arr = start.split('.')
    let start_string = start_arr[1]+'.'+start_arr[0]+'.'+start_arr[2]
    let end_arr = end.split('.')
    let end_string = end_arr[1]+'.'+end_arr[0]+'.'+end_arr[2]

    let start_en = new Date(start_string)
    let end_en = new Date(end_string)

    let number_of_days = (end_en.getTime() - start_en.getTime()) / (1000 * 3600 * 24)
    let date_range = []
    for(let i = 0; i < number_of_days; i++)
      date_range.push((i + start_en.getDay()) % 7 + 1)
    
    const weekend_days = date_range.filter(day => day == 5 || day == 6);
    let weekends = weekend_days.length
    let regulars = date_range.length - weekends

    let regular_price
    let weekend_price

    if(date_range.length > 1){
      regular_price = hut.regularPriceTwoNights*regulars
      weekend_price = hut.weekendPriceTwoNights*weekends      
    }
    else{
      regular_price = hut.regularPrice*regulars
      weekend_price = hut.weekendPrice*weekends      
    }
    let total_price = regular_price + weekend_price
    return [regular_price, weekend_price, total_price]
  }

  onCreditPointsChange(credit_points: number){
    this.points_to_use = credit_points
  }
  
  onlineOrder(): void{ }
  onFetchEditZimmer(){
    if(!this.edit){
      this.storage.fetchPendingZimmers().subscribe(zimmers => {
        let edited_zimmer = zimmers.filter(zimmer => {return zimmer.zimmer_id == this.zimmer_id})[0];
        if(edited_zimmer){
          this.zimmer = edited_zimmer;
          this.setLngLat();
          let css = document.getElementsByClassName('wrapper') as HTMLCollectionOf<HTMLElement>;
          css[0].style.setProperty('border-style', 'dashed');
          this.edit = true;
        }
      })
    }
    else{
      this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
        let active_zimmer = zimmers.filter(zimmer => {return zimmer.zimmer_id == this.zimmer_id})[0];
        if(active_zimmer){
          this.zimmer = active_zimmer;
          this.setLngLat();
          let css = document.getElementsByClassName('wrapper') as HTMLCollectionOf<HTMLElement>;
          css[0].style.setProperty('border-style', 'solid');
          this.edit = false;
        }
      })
    }
  }
}
