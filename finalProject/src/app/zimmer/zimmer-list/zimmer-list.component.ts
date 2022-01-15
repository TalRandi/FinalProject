import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-list',
  templateUrl: './zimmer-list.component.html',
  styleUrls: ['./zimmer-list.component.css']
})
export class ZimmerListComponent implements OnInit {

  hut: Hut[] = []
  zimmers_list:Zimmer[] = []

  constructor(private storage:DataStorageService) { }

  ngOnInit(): void {
    this.storage.fetchZimmers().subscribe(zimmers => {
      this.zimmers_list = zimmers  
    })
    
  }
}
