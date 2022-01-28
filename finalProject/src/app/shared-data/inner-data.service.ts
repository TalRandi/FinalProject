import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InnerDataService {
  
  subject = new Subject<Map<string, boolean>>();

  filters = ["ג'קוזי", "בריכה", "מזגן", "WiFi", "סאונה", "חניה"]
  filters_map = new Map<string, boolean>();
  
  regions = ['צפון', 'מרכז', 'ירושלים והסביבה', 'דרום'];
  regions_map = new Map<string, boolean>();

  constructor() {
    this.filters.forEach(filter => {
      this.filters_map.set(filter, false)
    })
    this.regions.forEach(region => {
      this.regions_map.set(region, false)
    })
  }
}
