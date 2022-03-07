import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-details',
  templateUrl: './zimmer-details.component.html',
  styleUrls: ['./zimmer-details.component.css']
})
export class ZimmerDetailsComponent implements OnInit {

  isLoading = false;
  zimmer_id: string;
  zimmer: Zimmer;
  start: Date;
  end: Date;
  regular_price: number = 0;
  weekend_price: number = 0;

  constructor(private storage: DataStorageService, private router: Router, private authService: AuthenticationService) { }

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
  onlineOrder(hut_name: any): void{
    // console.log(hut_name);
    // console.log(this.zimmer.zimmerName);
  }
  onOrderSubmition(){
    
  }

  dateRangeChange(dateRangeStart: any, dateRangeEnd: any, hut: Hut){
    this.start = new Date(dateRangeStart.value)
    this.end = new Date(dateRangeEnd.value)
    let number_of_days = (this.end.getTime() - this.start.getTime()) / (1000 * 3600 * 24)
    let date_range = []
    for(let i = 0; i < number_of_days; i++)
      date_range.push((i + this.start.getDay()) % 7 + 1)
    
    const weekend_days = date_range.filter(day => day == 5 || day == 6);
    let weekends = weekend_days.length
    let regulars = date_range.length - weekends

    if(date_range.length > 1){
      this.regular_price = hut.regularPriceTwoNights*regulars
      this.weekend_price = hut.weekendPriceTwoNights*weekends      
    }
    else{
      this.regular_price = hut.regularPrice*regulars
      this.weekend_price = hut.weekendPrice*weekends      
    }

  }

}
