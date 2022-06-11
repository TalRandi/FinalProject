import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
import { InnerDataService } from '../shared-data/inner-data.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  control = new FormControl();
  isLoggedIn = false;
  client: Client;
  points: number;
  isLoading = false
  zimmers: string[] = [];
  zimmers_names: string[] = [];
  filteredZimmers: Observable<string[]>;
  public isMenuCollapsed = true;
  constructor(public authService: AuthenticationService, public innerData: InnerDataService, private storage: DataStorageService) { }


  ngOnInit(): void { 

    this.storage.fetchAcceptedZimmers().subscribe(Zimmers => {
      Zimmers.forEach(z => {
        this.zimmers.push(z.zimmerName);
        this.zimmers.push(z.address.vicinity);
        this.zimmers_names.push(z.zimmerName);
      })
      this.zimmers = [...new Set(this.zimmers)];
    })

    this.filteredZimmers = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.userSub = this.authService.user.subscribe(user => {
      if(user){
        this.isLoggedIn = true;
        setTimeout(() => {
          this.loadClient();
        }, 500); 
      }
      else{
        this.isLoggedIn = false;
      }
    })
    if(this.authService.token){
      this.isLoggedIn = true;
      this.loadClient();
    }  
  }

  onZimmerSearch(zimmer_to_search: any): void{
    this.innerData.zimmer_to_search = zimmer_to_search
    this.innerData.string_subject.next(this.innerData.zimmer_to_search)
    this.isMenuCollapsed = !this.isMenuCollapsed 
  }

  ngOnDestroy(): void {
    if(this.userSub)
      this.userSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
    this.isLoggedIn = false;
  }
  loadClient(){
    if(this.authService.zimmer == 'client' && !this.authService.admin){
      this.isLoading = true;
      if(localStorage.getItem('userData')){
        var userData = JSON.parse(localStorage.getItem('userData')!.toString());
        this.storage.getClient(userData.email).subscribe(client => {
          this.client = client;
          this.points = this.client.points;
          this.isLoading = false;
        }) 
      }
    }
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.zimmers.filter(zimmer => this._normalizeValue(zimmer).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  isZimmerName(zimmer_name: string){
    return this.zimmers_names.includes(zimmer_name)
  }
}
