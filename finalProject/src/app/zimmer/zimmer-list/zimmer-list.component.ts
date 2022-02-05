import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { InnerDataService } from 'src/app/shared-data/inner-data.service';
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
export class ZimmerListComponent implements OnInit, OnDestroy {

  isLoading = false;
  sort_direction = true;
  private data: Subscription;
  
  sorts: Sort[] = [
    {value: 'all', viewValue: 'המומלצים שלנו'},
    {value: 'weekend', viewValue: 'מחיר - סופ"ש'},
    {value: 'midweek', viewValue: 'מחיר - אמצ"ש'},
    {value: 'huts_number', viewValue: 'מספר בקתות'},
    {value: 'total_capacity', viewValue: 'מקסימום אורחים'},
  ];

  hut: Hut[] = []
  all_zimmers:Zimmer[] = []
  zimmers_to_display:Zimmer[] = []
  dictionary = new Map<string, string>();
  general_filter: string[] = []
  region_filter: string[] = [] 

  constructor(private storage: DataStorageService, public innerData: InnerDataService) { }

  private removeElement(array: string[], element: string){
    const index = array.indexOf(element);
    if (index > -1) 
      array.splice(index, 1);
  }

  private removeZimmer(array: Zimmer[], zimmer: Zimmer){
    const index = array.indexOf(zimmer);
    if (index > -1) 
      array.splice(index, 1);
  }
  sortBy(event: any): void{
    this.isLoading = true
    let sort_parameter = event.value
    
    switch (sort_parameter) {
      case 'weekend':        
        this.zimmers_to_display.sort((a,b) => (a.min_price_weekend > b.min_price_weekend) ? 1 : ((b.min_price_weekend > a.min_price_weekend) ? -1 : 0))
        break;
      case 'midweek':
        this.zimmers_to_display.sort((a,b) => (a.min_price_regular > b.min_price_regular) ? 1 : ((b.min_price_regular > a.min_price_regular) ? -1 : 0))
        break;
      case 'huts_number':
        this.zimmers_to_display.sort((a,b) => (a.huts.length > b.huts.length) ? 1 : ((b.huts.length > a.huts.length) ? -1 : 0))
        break;
      case 'total_capacity':
        this.zimmers_to_display.sort((a,b) => (a.total_capacity > b.total_capacity) ? 1 : ((b.total_capacity > a.total_capacity) ? -1 : 0))
        break;
    
      default:
        break;
    }
    this.isLoading = false
  }
  sortDirection(): void{
    this.zimmers_to_display.reverse();
    this.sort_direction = !this.sort_direction
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.all_zimmers = zimmers  
      this.zimmers_to_display = [...this.all_zimmers]
      this.dictionary.set("בריכה", "pool")
      this.dictionary.set("ג'קוזי", "jacuzzi")
      this.dictionary.set("WiFi", "wifi")
      this.dictionary.set("סאונה", "sauna")
      this.dictionary.set("מזגן", "air_conditioner")
      this.dictionary.set("חניה", "parking")
      
      this.data = this.innerData.subject.subscribe(filters => {
        this.isLoading = true;
        this.zimmers_to_display = [...this.all_zimmers]

        if(filters.has("בריכה")){
          // Update the general_filter array
          filters.forEach((checked: boolean, filter: string) => {
            if(checked && !this.general_filter.includes(this.dictionary.get(filter)!))
              this.general_filter.push(this.dictionary.get(filter)!)
            else if(!checked && this.general_filter.includes(this.dictionary.get(filter)!))
              this.removeElement(this.general_filter, this.dictionary.get(filter)!)
          });
        }
        else if(filters.has("צפון")){
          // Update the region_filter array
          filters.forEach((checked: boolean, filter: string) => {
            if(checked && !this.region_filter.includes(filter))
              this.region_filter.push(filter)
            else if(!checked && this.region_filter.includes(filter))
              this.removeElement(this.region_filter, filter)
          });
        }

        for (let index_zimmer = 0; index_zimmer < this.zimmers_to_display.length; index_zimmer++) {
          if(this.zimmers_to_display[index_zimmer].features == undefined && this.general_filter.length != 0){
            this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
            index_zimmer--
            continue
          }
          for (let index_filter = 0; index_filter < this.general_filter.length; index_filter++) {
              if (!this.zimmers_to_display[index_zimmer].features.includes(this.general_filter[index_filter])) {
                this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
                index_zimmer--
                break
              }  
          }
          for (let index_region = 0; index_region < this.region_filter.length; index_region++) {
            if(this.zimmers_to_display[index_zimmer] == undefined)
              break     
            if(!this.region_filter.includes(this.zimmers_to_display[index_zimmer].region)){
              this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
              index_zimmer--
              break
            }
          }
        }
        this.isLoading = false;
      });
      this.isLoading = false;  
    })
  }
  ngOnDestroy(): void {
      this.data.unsubscribe();
  }
}
