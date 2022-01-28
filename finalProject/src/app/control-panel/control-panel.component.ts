import { Component, OnInit } from '@angular/core';
import { InnerDataService } from '../shared-data/inner-data.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})


export class ControlPanelComponent implements OnInit {

  constructor(public innerData: InnerDataService) { }

  ngOnInit(): void { }

  onFilterChange(event: any): void{
    this.innerData.filters_map.set(event.source.name, event.source.checked)
    this.innerData.subject.next(this.innerData.filters_map)
  }

  onRegionChange(event: any): void{
    this.innerData.regions_map.set(event.source.name, event.source.checked)
    this.innerData.subject.next(this.innerData.regions_map)
  }

}
