import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})


export class ControlPanelComponent implements OnInit {

  filters = ["ג'קוזי", "בריכה", "מזגן", "WiFi", "סאונה", "צימרים בצפון", "צימרים בנגב"]

  constructor() { }

  ngOnInit(): void { 

  }

}
