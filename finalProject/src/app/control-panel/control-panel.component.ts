import { Component, OnInit } from '@angular/core';
import { InnerDataService } from '../shared-data/inner-data.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})


export class ControlPanelComponent implements OnInit {

  constructor(public innerData: InnerDataService) { }

  regions_arr: any[] = []
  filters_arr: any[] = []
  huts_number_arr: any[] = []

  ngOnInit(): void {

    this.innerData.regions_map.forEach((value, region) => {
      this.regions_arr.push({name: region, value: value})
    })
    
    this.innerData.filters_map.forEach((value, filter) => {
      this.filters_arr.push({name: filter, value: value})
    })
    
    this.innerData.huts_map.forEach((value, hut_number) => {          
      this.huts_number_arr.push({name: hut_number, value: value})
    });

  }

  onFilterChange(event: any): void{
    this.innerData.filters_map.set(event.source.name, event.source.checked)
    this.innerData.subject.next(this.innerData.filters_map)
  }

  onRegionChange(event: any): void{    
    this.innerData.regions_map.set(event.source.name, event.source.checked)
    this.innerData.subject.next(this.innerData.regions_map)
  }

  onHutsNumber(event: any): void{
    this.innerData.huts_map.forEach((is_true, num) => {
      if(event.value == num)
        this.innerData.huts_map.set(event.value, true)
      else
        this.innerData.huts_map.set(num, false)
    })
    this.innerData.subject.next(this.innerData.huts_map)
  }

}
