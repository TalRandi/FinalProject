import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  accepted_zimmers: Zimmer[] = [];
  requests: string[] = [];
  requests_archive: string[] = [];

  onSubmitZimmer(zimmer: Zimmer, index: number){
    zimmer.status = "accepted";
    this.storage.storeAcceptedZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
    });
  }
  onRejectZimmer(zimmer: Zimmer, index: number){
    zimmer.status = 'pending_rejected';
    this.storage.rejectZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
    })
  }
  onSubmitAcceptedZimmer(zimmer: Zimmer, index: number){
    this.storage.storeEditedZimmer(zimmer).subscribe(() => {
      this.accepted_zimmers.splice(index, 1);
    })
  }
  onRejectAcceptedZimmer(zimmer: Zimmer, index: number){
    zimmer.status = 'accepted_rejected';
    this.storage.rejectZimmer(zimmer).subscribe(() => {
      this.accepted_zimmers.splice(index, 1);
    })
  }
  onSubmitRequest(request: string, index: number){
    this.storage.approveRequest(request).subscribe(() => {
      this.requests.splice(index, 1);
      this.requests_archive.push(request);
    })
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchPendingZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(pending_zimmers => {
      pending_zimmers.forEach(zimmer => {
        if(zimmer.status == 'pending')
          this.zimmers.push(zimmer);
        else if(zimmer.status == 'accepted')
          this.accepted_zimmers.push(zimmer);  
      })
    });
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
