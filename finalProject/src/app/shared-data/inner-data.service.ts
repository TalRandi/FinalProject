import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InnerDataService {
  
  subject = new Subject<Map<string, boolean>>();
  string_subject = new Subject<String>();
  number_subject = new Subject<number>();

  zimmer_to_search = ""
  number_of_guests = 2

  filters = ["ג'קוזי" ,"בריכה" ,"בריכה מחוממת" ,"בריכה מקורה" ,"מזגן", "WiFi", "סאונה", "חניה"]
  filters_map = new Map<string, boolean>();
  
  regions = ['צפון', 'מרכז', 'ירושלים והסביבה', 'דרום'];
  regions_map = new Map<string, boolean>();

  huts_number = ['הכל', '1', '2', '3', '4', '5', '6+']
  huts_map = new Map<string, boolean>();

  constructor() {
    this.resetAll();
  }

  resetAll(){
    this.filters.forEach(filter => {
      this.filters_map.set(filter, false)
    })
    this.regions.forEach(region => {
      this.regions_map.set(region, false)
    })
    this.huts_number.forEach(number => {
      this.huts_map.set(number, false)
    })
  }
}
