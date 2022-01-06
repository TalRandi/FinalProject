import { Component, OnInit } from '@angular/core';

interface Sort {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})


export class ControlPanelComponent implements OnInit {

  filters = ["ג'קוזי", "בריכה", "מזגן", "WiFi", "סאונה", "צימרים בצפון", "צימרים בנגב"]
  sorts: Sort[] = [
    {value: 'all', viewValue: 'המומלצים'},
    {value: 'center', viewValue: 'מחיר'},
  ];
  constructor() { }

  ngOnInit(): void { 

  }

}
