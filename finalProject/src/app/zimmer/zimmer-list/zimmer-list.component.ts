import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Client } from 'src/app/shared-data/client.model';
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
  
  sorts: Sort[] = [
    {value: 'all', viewValue: 'הכל'},
    {value: 'weekend', viewValue: 'מחיר - סופ"ש'},
    {value: 'midweek', viewValue: 'מחיר - אמצ"ש'},
    {value: 'huts_number', viewValue: 'מספר בקתות'},
    {value: 'total_capacity', viewValue: 'מקסימום אורחים'},
  ];

  currentRate = 8;
  client: Client;
  isLoading = false;
  sort_direction = true;
  number_of_guests: number;
  private data: Subscription;
  hut: Hut[] = []
  all_zimmers:Zimmer[] = []
  zimmers_to_display:Zimmer[] = []
  dictionary = new Map<string, string>();
  general_filter: string[] = []
  region_filter: string[] = []
  huts_number_filter: string = "";
  sort_parameter: string = "all";


  constructor(private storage: DataStorageService, public innerData: InnerDataService, private router: Router) { }

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
    this.sort_parameter = event.value
    
    switch (this.sort_parameter) {
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
    if(this.sort_parameter == "all")
      return 
    
    this.zimmers_to_display.reverse();
    this.sort_direction = !this.sort_direction
  }

  zimmer_clicked(zimmer: Zimmer): void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/home/${zimmer.zimmer_id}`])
    );
  
    window.open(url, '_blank');
  }

  ngOnInit(): void {

    this.number_of_guests = this.innerData.number_of_guests
    
    this.isLoading = true;
    if(localStorage.getItem('userData')){
      var userData = JSON.parse(localStorage.getItem('userData')!.toString());
      if(userData.zimmer == 'client' && userData.admin == false){
        this.storage.getClient(userData.email).subscribe(client => {
          this.client = client;
          if(!this.client.favorites){
            this.client.favorites = [];
          }
        })
      }
    }
    
    this.storage.fetchAcceptedZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(zimmers => {
      this.all_zimmers = zimmers.filter(zimmer => zimmer.status != 'disabled');  
      this.zimmers_to_display = [...this.all_zimmers]
      this.dictionary.set("בריכה", "pool")
      this.dictionary.set("בריכה מחוממת", "heated_pool")
      this.dictionary.set("בריכה מקורה", "indoor_pool")
      this.dictionary.set("ג'קוזי", "jacuzzi")
      this.dictionary.set("WiFi", "wifi")
      this.dictionary.set("סאונה", "sauna")
      this.dictionary.set("מזגן", "air_conditioner")
      this.dictionary.set("חניה", "parking")
      
      this.innerData.regions_map.forEach((value, region) => {
        if(value)
          this.region_filter.push(region)
      })
      
      this.innerData.filters_map.forEach((value, filter) => {
        if(value)
          this.general_filter.push(this.dictionary.get(filter)!)
      })   
    
      this.innerData.huts_map.forEach((value, hut_number) => {
        if(value)
          this.huts_number_filter = hut_number
      })  

      this.applyFilters()
      
      this.data = this.innerData.string_subject.subscribe(zimmer_to_search => {
        
        this.zimmers_to_display = [...this.all_zimmers]
        if(zimmer_to_search == '')
          return

        this.isLoading = true;
        setTimeout(() => {
          for (let index_zimmer = 0; index_zimmer < this.zimmers_to_display.length; index_zimmer++) {
            if(this.zimmers_to_display[index_zimmer] == undefined)
              break     
            if(this.zimmers_to_display[index_zimmer].zimmerName != zimmer_to_search){
              this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
              index_zimmer--
            }
          }
          this.isLoading = false;
        }, 500)
      })


      this.data = this.innerData.number_subject.subscribe(number_of_guests => {
       
        this.number_of_guests = number_of_guests 
    
        this.isLoading = true;
 
        setTimeout(() => {

          this.applyFilters()
          this.isLoading = false;

        }, 500)
      })

      this.data = this.innerData.subject.subscribe(filters => {
        
        // this.alreadySubscribed = true
        
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
        else if(filters.has("1")){
          // Update the huts_number array
          filters.forEach((checked: boolean, filter: string) => {            
            if(checked && this.huts_number_filter != filter)
              this.huts_number_filter = filter
          });
        }
        this.applyFilters()
      });
    })
  }


  applyFilters(): void {
    
    this.zimmers_to_display = [...this.all_zimmers]
    
    for (let index_zimmer = 0; index_zimmer < this.zimmers_to_display.length; index_zimmer++) {

      if(this.zimmers_to_display[index_zimmer].features == undefined && this.general_filter.length != 0){
        this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
        index_zimmer--
        continue
      }
      if(this.huts_number_filter != ""){
        
        if(this.huts_number_filter == "הכל"){
          this.huts_number_filter = "";
          console.log(this.zimmers_to_display);
        }
        else if(this.zimmers_to_display[index_zimmer].huts.length+'' != this.huts_number_filter){
          this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
          index_zimmer--
          continue
        }
        else if(this.huts_number_filter == "6+" && this.zimmers_to_display[index_zimmer].huts.length < 6){
          this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
          index_zimmer--
          continue
        }
      }
      if(this.number_of_guests){
        
        if(this.zimmers_to_display[index_zimmer] == undefined)
          break     
        if(this.zimmers_to_display[index_zimmer].total_capacity < this.number_of_guests){
          this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
          index_zimmer--
          continue
        }
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
  }

  isFavorite(zimmer_id: string){
    
    return this.client.favorites.map(zimmer => zimmer.zimmer_id).includes(zimmer_id)
  }

  ngOnDestroy(): void {
    if(this.data)
      this.data.unsubscribe();
  }
}
