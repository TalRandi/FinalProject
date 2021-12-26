import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zimmer-list',
  templateUrl: './zimmer-list.component.html',
  styleUrls: ['./zimmer-list.component.css']
})
export class ZimmerListComponent implements OnInit {

  zimmers_list = [1, 2, 3, 4, 5]

  constructor() { }

  ngOnInit(): void {
  }

}
