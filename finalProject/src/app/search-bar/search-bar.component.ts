import { Component, OnInit } from '@angular/core';
import { InnerDataService } from '../shared-data/inner-data.service';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})


export class SearchBarComponent implements OnInit {

  constructor(public innerData: InnerDataService) { }

  json_query = {start: "", 
                end: "", 
                number_of_guests: 2,
                region: "", 
                }
  private queryExpirationTimer: any;

  ngOnInit(): void {
    
    if(localStorage.getItem('Query')){
      this.json_query = JSON.parse(localStorage.getItem('Query')!.toString());
      this.setQueryTimeOut()
    }

  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    
    this.json_query.start = this.formatDate(dateRangeStart.value)  
    this.json_query.end = this.formatDate(dateRangeEnd.value)
  }

  onRegionChange(event: any): void{   
    this.json_query.region = event
  }

  onSendQuery(number_of_guests: number): void{

    this.json_query.number_of_guests = number_of_guests;
    localStorage.setItem('Query', JSON.stringify(this.json_query));

    this.setQueryTimeOut()
    this.launchQuery()
  }

  setQueryTimeOut(): void{
    this.queryExpirationTimer = setTimeout(() => {
      localStorage.removeItem('Query');
      if(this.queryExpirationTimer){
          clearTimeout(this.queryExpirationTimer);
      }
    }, 10000)
  }

  launchQuery(){
    
    if(this.json_query.region != ''){
      this.innerData.regions_map.forEach((value, region) => {
        if(region != this.json_query.region && value == true){
          this.innerData.regions_map.set(region, false)
        }
      })
      this.innerData.regions_map.set(this.json_query.region, true)
      this.innerData.subject.next(this.innerData.regions_map)
    }
    this.innerData.number_of_guests = this.json_query.number_of_guests
    this.innerData.number_subject.next(this.innerData.number_of_guests)
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

    return res[0]+'-'+res[1]+'-'+res[2]
  }
}
