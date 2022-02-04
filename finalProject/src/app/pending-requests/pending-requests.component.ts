import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {

  @ViewChild('form') contact_us_form: NgForm;
  isLoading = false;

  constructor(private storage: DataStorageService) { }

  zimmers: Zimmer[] = []
  requests: string[] = [];

  onSubmitZimmer(zimmer: Zimmer, index: number){
    this.storage.storeAcceptedZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
    });
  }

  onSubmitRequest(request: string, index: number){
    this.storage.approveRequest(request).subscribe(() => {
      this.requests.splice(index, 1);
    })
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchPendingZimmers().subscribe(pending_zimmers => {
      this.zimmers = pending_zimmers;
      this.isLoading = false;
    },
    error => this.isLoading = false
    );
    this.storage.fetchRequests().subscribe(stored_requests => this.requests = stored_requests);
  }

}
