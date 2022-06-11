import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Client } from 'src/app/shared-data/client.model';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { EmailService } from 'src/app/shared-data/email.service';
import { Hut } from 'src/app/shared-data/hut.model';
import { InnerDataService } from 'src/app/shared-data/inner-data.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';
import {Pipe} from '@angular/core';
interface Sort {
  value: string;
  viewValue: string;
}

@Pipe({name: 'round'})
export class RoundPipe {
  transform (input:number) {
    return Math.round(input);
  }
}


@Component({
  selector: 'app-zimmer-list',
  templateUrl: './zimmer-list.component.html',
  styleUrls: ['./zimmer-list.component.css']
})
export class ZimmerListComponent implements OnInit, OnDestroy {
  
  
  sorts: Sort[] = [
    {value: 'rating', viewValue: 'דירוג'},
    {value: 'weekend', viewValue: 'מחיר - סופ"ש'},
    {value: 'midweek', viewValue: 'מחיר - אמצ"ש'},
    {value: 'huts_number', viewValue: 'מספר בקתות'},
    {value: 'total_capacity', viewValue: 'מקסימום אורחים'},
  ];

  currentRate = 8;
  client: Client;
  isLoading = false;
  sort_direction = false;
  number_of_guests: number;
  private data: Subscription;
  hut: Hut[] = []
  all_zimmers:Zimmer[] = []
  disabled_zimmers:Zimmer[] = []
  zimmers_to_display:Zimmer[] = []
  dictionary = new Map<string, string>();
  general_filter: string[] = []
  region_filter: string[] = []
  huts_number_filter: string = "";
  sort_parameter: string = "rating";
  zimmer_to_search: String = "";

  unavailable_dates: { zimmer_name: string, hut_name: string, start_date: Date, end_date: Date }[] = []
  json_query: {start: string, end: string, number_of_guests: number, region: string };

  private queryExpirationTimer: any;

  constructor(private storage: DataStorageService, public innerData: InnerDataService, private router: Router, public authService: AuthenticationService,
              private emailService: EmailService) { }

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

  getByValue(map: Map<string, string>, searchValue: string) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
    return undefined
  }

  sortBy(event: any): void{
    this.isLoading = true
    this.sort_parameter = event
    
    setTimeout(() => {
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
        case 'rating':
          this.zimmers_to_display.sort((a,b) => (a.rate > b.rate) ? 1 : ((b.rate > a.rate) ? -1 : 0))    
          break;
        default:
          break;
      }
      if(!this.sort_direction){
        this.zimmers_to_display.reverse();
      }
      this.isLoading = false
    }, 200);
  }
  sortDirection(): void{ 
 
    this.isLoading = true
    setTimeout(() => {
      this.zimmers_to_display.reverse();
      this.sort_direction = !this.sort_direction
      this.isLoading = false
    }, 200);
  }

  zimmer_clicked(zimmer: Zimmer): void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/home/${zimmer.zimmer_id}`])
    );
  
    window.open(url, '_blank');
  }

  setQueryTimeOut(): void{
    this.queryExpirationTimer = setTimeout(() => {
      localStorage.removeItem('Query');
      if(this.queryExpirationTimer){
          clearTimeout(this.queryExpirationTimer);
      }
    }, 10000)
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
    
      this.all_zimmers.forEach(zimmer => zimmer.huts.forEach(hut => {
        if(hut.events)
        {
          hut.events.forEach(event => {
            this.unavailable_dates.push({
              zimmer_name: zimmer.zimmerName,
              hut_name: hut.hutName,
              start_date: parseISO(event.start.toString()),
              end_date: parseISO(event.end!.toString())
            })
          })
        }
      }))


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
      this.applySort();
      this.data = this.innerData.string_subject.subscribe(zimmer_to_search => {
        this.zimmer_to_search = zimmer_to_search;
        this.zimmers_to_display = [...this.all_zimmers]
        if(zimmer_to_search == '')
          return

        this.isLoading = true;
        setTimeout(() => {
          for (let index_zimmer = 0; index_zimmer < this.zimmers_to_display.length; index_zimmer++) {
            if(this.zimmers_to_display[index_zimmer] == undefined)
              break     
            if(this.zimmers_to_display[index_zimmer].zimmerName != zimmer_to_search && this.zimmers_to_display[index_zimmer].address.vicinity != zimmer_to_search){
              this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
              index_zimmer--
            }
          }
          this.applySort();
          this.innerData.resetAll();
          this.general_filter = []
          this.region_filter = []
          this.huts_number_filter = "";
          this.isLoading = false;
        }, 500)
      })


      this.data = this.innerData.number_subject.subscribe(number_of_guests => {
       
        this.number_of_guests = number_of_guests 
        
        if(localStorage.getItem('Query')){
          this.json_query = JSON.parse(localStorage.getItem('Query')!.toString());
          this.setQueryTimeOut()
        }

        this.isLoading = true;

        setTimeout(() => {

          this.applyFilters()
          this.isLoading = false;

        }, 500)
      })

      this.data = this.innerData.subject.subscribe(filters => {
        
        this.isLoading = true;
        
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
        this.isLoading = false;
      });
    })
  }


  applyFilters(): void {
    
    this.zimmers_to_display = [...this.all_zimmers]
    this.zimmer_to_search = "";
    
    for (let index_zimmer = 0; index_zimmer < this.zimmers_to_display.length; index_zimmer++) {

      if(this.zimmers_to_display[index_zimmer].features == undefined && this.general_filter.length != 0){
        this.removeZimmer(this.zimmers_to_display, this.zimmers_to_display[index_zimmer])
        index_zimmer--
        continue
      }
      if(this.huts_number_filter != ""){
        
        if(this.huts_number_filter == "הכל"){
          this.huts_number_filter = "";
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
      if(this.json_query && this.json_query.start && this.json_query.end){
        
        if(!this.hasAvailableHut(this.zimmers_to_display[index_zimmer])){
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
    this.applySort();
  }

  applySort(){
    this.isLoading = true;
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
      case 'rating':
        this.zimmers_to_display.sort((a,b) => (a.rate > b.rate) ? 1 : ((b.rate > a.rate) ? -1 : 0))    
        break;
      default:
        break;
    }
    if(!this.sort_direction){
      this.zimmers_to_display.reverse();
    }
    this.isLoading = false
  }

  hasAvailableHut(zimmer: Zimmer){

    let is_available = false

    zimmer.huts.forEach(hut => {
      if(hut.events){
        if(this.isAvailable(hut))
          is_available = true
      }
      else{
        is_available = true
      }
    })
    return is_available
  }

  isAvailable(hut: Hut){

    let result = true

    let desired_start = parseISO(this.json_query.start.toString())
    let desired_end = parseISO(this.json_query.end.toString())

    const d_date = new Date(desired_start.getTime());

    d_date.setDate(d_date.getDate() + 1);
  
    const desired_between = [desired_start.toLocaleDateString()];
  
    while(d_date < desired_end) {
      desired_between.push(new Date(d_date).toLocaleDateString());
      d_date.setDate(d_date.getDate() + 1);
    }
    
    let event_between: any = []

    hut.events.forEach(event => {

      let event_start = parseISO(event.start.toString())
      let event_end = parseISO(event.end!.toString())

      const e_date = new Date(event_start.getTime());

      // e_date.setDate(e_date.getDate() + 1);
      
      event_between = [];
    
      while(e_date < event_end) {
        event_between.push(new Date(e_date).toLocaleDateString());
        e_date.setDate(e_date.getDate() + 1);
      }
      let intersection = event_between.filter((date: string) => desired_between.includes(date))
    
      if(intersection.length > 0)
        result = false
    })
    
    return result
  }

  isFavorite(zimmer_id: string){
    
    return this.client.favorites.map(zimmer => zimmer.zimmer_id).includes(zimmer_id)
  }

  favoriteClicked(favoriteZimmer: Zimmer, status: string){
    
    const index = this.zimmers_to_display.indexOf(favoriteZimmer);
    if (index > -1) 
      this.zimmers_to_display.splice(index, 1);

    if(status == "addFavorite")
      this.client.favorites.push(favoriteZimmer)    
    
    else if(status == "removeFavorite")
      this.client.favorites = this.client.favorites.filter(zimmer => zimmer.zimmer_id != favoriteZimmer.zimmer_id)
    
    this.zimmers_to_display.splice(index, 0, favoriteZimmer);
    this.storage.updateClient(this.client).subscribe();
    
  }

  disableZimmer(zimmer: Zimmer, index: number){
    this.isLoading = true;
    zimmer.status = "disabled"
    this.zimmers_to_display.splice(index, 1);

    let header = zimmer.ownerName + ", שלום רב "
    let message = "זוהי הודעה על חסימת הצימר - " + zimmer.zimmerName
    this.emailService.sendEmail(header, zimmer.email, message, "GoEasy")

    this.storage.updateZimmer(zimmer).pipe(finalize(() => this.isLoading = false)).subscribe()
  }

  ngOnDestroy(): void {
    if(this.data)
      this.data.unsubscribe();
  }
}
