import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';


interface Sort {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-zimmer-list',
  templateUrl: './zimmer-list.component.html',
  styleUrls: ['./zimmer-list.component.css']
})
export class ZimmerListComponent implements OnInit {

  hut: Hut[] = []
  zimmers_list:Zimmer[] = []

  sorts: Sort[] = [
    {value: 'all', viewValue: 'המומלצים'},
    {value: 'center', viewValue: 'מחיר'},
  ];

  constructor(private storage:DataStorageService) { }

  ngOnInit(): void {
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.zimmers_list = zimmers  
    })
    
  }
}
