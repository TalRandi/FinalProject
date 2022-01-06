import { Component, OnInit } from '@angular/core';
import { Hut } from 'src/app/shared-data/hut.model';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-list',
  templateUrl: './zimmer-list.component.html',
  styleUrls: ['./zimmer-list.component.css']
})
export class ZimmerListComponent implements OnInit {

  hut: Hut[] = []

  zimmers_list = [new Zimmer("משה כהן", "0543335533", "בקתת החלומות", "470", "500", 5, "מרכז", [], this.hut),
                  new Zimmer("איתי אמסלם", "0524478593", "וילת הצפון", "580", "650", 8, "צפון", [], this.hut),
                  new Zimmer("ירדן לוי", "0501234522", "הנסיכה", "290", "340", 4, "דרום", [], this.hut)]

  constructor() { }

  ngOnInit(): void {
  }

}
