import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Order } from 'src/app/shared-data/order.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-details',
  templateUrl: './zimmer-details.component.html',
  styleUrls: ['./zimmer-details.component.css']
})

export class ZimmerDetailsComponent implements OnInit {

  @ViewChildren('form') form: QueryList<NgForm>;
  @ViewChildren('dateRangeStart') dateStart: QueryList<ElementRef>;
  @ViewChildren('dateRangeEnd') dateEnd: QueryList<ElementRef>;

  isLoading = false;
  zimmer_id: string;
  zimmer: Zimmer;

  constructor(private storage: DataStorageService, private router: Router, private authService: AuthenticationService, private _snackBar: MatSnackBar) { }

  
  ngOnInit(): void {
    this.isLoading = true
    this.zimmer_id = this.router.url.split('/').pop()!
      
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.zimmer = zimmers.filter(zimmer => {
        return zimmer.zimmer_id == this.zimmer_id
      })[0]
      this.isLoading = false;
      if(this.zimmer === undefined && !this.authService.admin){
        this.router.navigate(['/not-found']);
      }
      else if(this.zimmer === undefined && this.authService.admin){
        this.storage.fetchPendingZimmers().subscribe(zimmers => {
          this.zimmer = zimmers.filter(zimmer => {
            return zimmer.zimmer_id == this.zimmer_id
          })[0]
        })
      }
    })
  }
  onOrderSubmition(hut: Hut, index: number){

    let start = this.dateStart.get(index)?.nativeElement.value
    let end = this.dateEnd.get(index)?.nativeElement.value

    let order = new Order(
      this.zimmer.zimmerName,
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
      this.calculatePricing(start, end, hut)[2]
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
      this.storage.approveOrder(this.zimmer).subscribe()
    })
    
    this._snackBar.open("הזמנת התקבלה, נעדכן כאשר בעל הצימר יאשר אותה.", "אישור", {
      duration: 10000,
      panelClass: ['my-snackbar', 'login-snackbar'],
     });
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
  
  onlineOrder(): void{ }
}
