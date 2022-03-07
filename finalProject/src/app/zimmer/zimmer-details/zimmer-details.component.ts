import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-details',
  templateUrl: './zimmer-details.component.html',
  styleUrls: ['./zimmer-details.component.css']
})
export class ZimmerDetailsComponent implements OnInit {

  isLoading = false;
  zimmer_id: string;
  zimmer: Zimmer;

  constructor(private storage: DataStorageService, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.zimmer_id = this.router.url.split('/').pop()!
      
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.zimmer = zimmers.filter(zimmer => {
        return zimmer.zimmer_id == this.zimmer_id
      })[0]
      this.isLoading = false;
      if(this.zimmer === undefined && !this.authService.admin){
        this.router.navigate(['/not-found']);
      }
      else if(this.zimmer === undefined && this.authService.admin){
        this.storage.fetchPendingZimmers().subscribe(zimmers => {
          this.zimmer = zimmers.filter(zimmer => {
            return zimmer.zimmer_id == this.zimmer_id
          })[0]
        })
      }
    })
  

    

  }

}
