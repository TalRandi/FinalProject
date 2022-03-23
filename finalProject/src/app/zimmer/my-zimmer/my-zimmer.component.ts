import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-my-zimmer',
  templateUrl: './my-zimmer.component.html',
  styleUrls: ['./my-zimmer.component.css']
})
export class MyZimmerComponent implements OnInit {

  isLoading = false;
  my_zimmer: Zimmer[];
  constructor(private storage: DataStorageService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.my_zimmer = zimmers.filter(zimmer => zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
      if(this.my_zimmer.length == 0)
        this.storage.fetchPendingZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(pending_zimmers => {
          this.my_zimmer = pending_zimmers.filter(pending_zimmer => pending_zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
        })
      else
        this.isLoading = false;       
    })
  }
}
