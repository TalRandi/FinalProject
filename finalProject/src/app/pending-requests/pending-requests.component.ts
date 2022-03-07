import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {

  isLoading = false;

  constructor(private storage: DataStorageService, private router: Router) { }

  zimmers: Zimmer[] = [];
  requests: string[] = [];
  requests_archive: string[] = [];

  onSubmitZimmer(zimmer: Zimmer, index: number){
    this.storage.storeAcceptedZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
    });
  }

  onSubmitRequest(request: string, index: number){
    this.storage.approveRequest(request).subscribe(() => {
      this.requests.splice(index, 1);
      this.requests_archive.push(request);
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
    this.storage.fetchArchivedRequests().subscribe(archived_requests => this.requests_archive = archived_requests);
  }
  zimmer_clicked(zimmer: Zimmer): void{

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/home/${zimmer.zimmer_id}`])
    );
    window.open(url, '_blank');
  }
}
