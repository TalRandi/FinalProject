import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared-data/data-storage.service';
import { Zimmer } from 'src/app/shared-data/zimmer.model';
import { EmailService } from '../shared-data/email.service';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {

  isLoading = false;

  constructor(private storage: DataStorageService, private router: Router, private emailService: EmailService) { }

  zimmers: Zimmer[] = [];
  accepted_zimmers: Zimmer[] = [];
  disabled_zimmers: Zimmer[] = [];
  requests: string[] = [];
  requests_archive: string[] = [];
  requests_index:boolean[] = []
  reject_pending_response_index:boolean[] = []
  reject_edited_pending_response_index:boolean[] = []

  onSubmitZimmer(zimmer: Zimmer, index: number){
    zimmer.status = "accepted";
    this.storage.storeAcceptedZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
      let header = zimmer.ownerName + ", שלום רב "
      let message = "אנו שמחים להודיע כי הצימר - " + zimmer.zimmerName + " התקבל ונוסף בהצלחה לרשימת הצימרים שלנו!"
      this.emailService.sendEmail(header, zimmer.email, message, "GoEasy")
    });

  }

  onSubmitAcceptedZimmer(zimmer: Zimmer, index: number){
    this.storage.storeEditedZimmer(zimmer).subscribe(() => {
      this.accepted_zimmers.splice(index, 1);
      let header = zimmer.ownerName + ", שלום רב "
      let message = "אנו שמחים להודיע כי הגרסה החדשה - " + zimmer.zimmerName + " התקבלה ונוספה בהצלחה לרשימת הצימרים שלנו!"
      this.emailService.sendEmail(header, zimmer.email, message, "GoEasy")
    })
  }

  onRejectEditedZimmer(zimmer: Zimmer, index: number, response: string){
    zimmer.status = 'pending_rejected';
    this.storage.rejectZimmer(zimmer).subscribe(() => {
      this.zimmers.splice(index, 1);
      
      let header = zimmer.ownerName + ", שלום רב "
      let line1 = "לצערנו, הגרסה - " + zimmer.zimmerName + " אינה עברה את הסקירה ולא תפורסם"
      let line2 = ":סיבת הדחייה "
      let line3 = "`" + response + "`"
      let line4 = ".ניתן לערוך מחדש ולהגיש לבדיקה חוזרת"
      let line5 = ".שים לב - הגרסה הישנה עדיין קיימת ומוצגת באתר"
      this.emailService.sendLongEmail(header, zimmer.email, line1, line2, line3, line4, line5,
                                      "", "", "", "", "GoEasy")
    })
  }

  onRejectAcceptedZimmer(zimmer: Zimmer, index: number, response: string){
    zimmer.status = 'accepted_rejected';
    this.storage.rejectZimmer(zimmer).subscribe(() => {
      this.accepted_zimmers.splice(index, 1);

      let header = zimmer.ownerName + ", שלום רב "
      let line1 = "לצערנו, הגרסה - " + zimmer.zimmerName + " אינה עברה את הסקירה ולא תפורסם"
      let line2 = ":סיבת הדחייה "
      let line3 = "`" + response + "`"
      let line4 = ".ניתן לערוך מחדש ולהגיש לבדיקה חוזרת"
      this.emailService.sendLongEmail(header, zimmer.email, line1, line2, line3, line4, "",
                                      "", "", "", "", "GoEasy")
    })
  }

  onSubmitZimmerRejection(index: number){
    this.reject_pending_response_index[index] = !this.reject_pending_response_index[index] 
  }
  onSubmitZimmerRejectionEdit(index: number){
    this.reject_edited_pending_response_index[index] = ! this.reject_edited_pending_response_index[index] 
  }

  onSubmitRequest(index: number){
    this.requests_index[index] = !this.requests_index[index] 
  }

  onAdminResponse(request: string, index: number, response: string){

    let header = request[0] + " " + request[1] + ", שלום רב "
    
    let line1 = "התקבלה תשובה לפניה - " + request[5]
    let line2 = ":תוכן הפניה"
    let line3 = request[4]
    
    let line4 = ":תשובת מנהלי האתר"
    let line5 = response

    this.emailService.sendLongEmail(header, request[2], line1, line2, line3, "", line4,
                                    line5, "", "", "", "GoEasy")

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
      for (let i = 0; i < this.zimmers.length; i++)
        this.reject_pending_response_index.push(true)   
      for (let i = 0; i < this.accepted_zimmers.length; i++)
        this.reject_edited_pending_response_index.push(true)   
    });
    this.storage.fetchAcceptedZimmers().subscribe(zimmers => {
      this.disabled_zimmers = zimmers.filter(zimmer => zimmer.status == 'disabled'); 
    })

    this.storage.fetchRequests().subscribe(stored_requests => {
      this.requests = stored_requests
      for (let i = 0; i < this.requests.length; i++)
        this.requests_index.push(true)        
    })
    this.storage.fetchArchivedRequests().subscribe(archived_requests => this.requests_archive = archived_requests);
  }

  zimmer_clicked(zimmer: Zimmer): void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/home/${zimmer.zimmer_id}`])
    );
    window.open(url, '_blank');
  }

  enableZimmer(zimmer: Zimmer, index: number){
    zimmer.status = "accepted"
    this.disabled_zimmers.splice(index, 1);

    let header = zimmer.ownerName + ", שלום רב "
    let enable_message = "זוהי הודעה על ביטול החסימה לצימר - " + zimmer.zimmerName
    this.emailService.sendEmail(header, zimmer.email, enable_message, "GoEasy")
    
    this.storage.updateZimmer(zimmer).subscribe()
  }

}
