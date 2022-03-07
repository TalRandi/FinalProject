import { Component, OnInit } from '@angular/core';

interface Region {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
  }

  regions: Region[] = [
    {value: 'all', viewValue: 'הכל'},
    {value: 'north', viewValue: 'צפון'},
    {value: 'center', viewValue: 'מרכז'},
    {value: 'south', viewValue: 'דרום'},
  ];
}
