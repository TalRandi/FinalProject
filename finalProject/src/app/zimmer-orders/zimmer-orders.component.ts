import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataStorageService } from '../shared-data/data-storage.service';
import { EmailService } from '../shared-data/email.service';
import { Order } from '../shared-data/order.model';
import { Zimmer } from '../shared-data/zimmer.model';

@Component({
  selector: 'app-zimmer-orders',
  templateUrl: './zimmer-orders.component.html',
  styleUrls: ['./zimmer-orders.component.css']
})
export class ZimmerOrdersComponent implements OnInit {

  isLoading = false;
  my_zimmer: Zimmer[];
  orders: Order[] = [];
  orders_archive: Order[] = [];

  constructor(private storage: DataStorageService, private authService: AuthenticationService,
              private emailService: EmailService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().subscribe(result => {   
      this.my_zimmer = result.filter(zimmer => zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
      if(this.my_zimmer[0] && this.my_zimmer[0].orders){
        this.my_zimmer[0].orders.forEach(order => {
          if(order.isApproved){
            this.orders_archive.push(order);
          }
          else{
            this.orders.push(order);
          }
        }) 
      }
      this.isLoading = false;
    },
    error => this.isLoading = false)
  }

  onApproveOrder(order: Order, index: number){
    if(this.my_zimmer[0].orders){
      this.my_zimmer[0].orders.forEach(stored_order => {
        if(stored_order.order_id == order.order_id){
          stored_order.isApproved = true;
          this.storage.setApproveOnBoth(this.my_zimmer[0], order.order_id);
        }
      })
    }
    order.isApproved = true;
    this.orders.splice(index, 1);
    this.orders_archive.push(order);

    let header = order.email + ", שלום רב "
    let line1 = "!הזמנתך התקבלה"
    let line2 = "לצימר - " + order.zimmerName
    let line3 =  "ליחידה - " + order.hut_name
    let line4 = "בתאריך - " + order.start_date + " ועד לתאריך - " + order.end_date
    let line5 = "מספר אורחים: " + order.guests
    let line6 = " שם האורח - " + order.name
    let line7 = "מספר פלאפון - " + order.phone
    let line8 = "בקשות מיוחדות - "
    line8 += (order.requests ? order.requests: "אין")
    let line9 = "!חופשה מהנה"
    
    this.emailService.sendLongEmail(header, order.email, line1, line2, line3, line4, line5,
                                    line6, line7, line8, line9, "GoEasy")

  }
  onCancelOrder(order: Order, index: number){
    this.storage.cancelOrderOnBoth(order.order_id, order.points_used);
    this.orders.splice(index, 1);

    
    let header = order.email + ", שלום רב "
    let line1 = ".לצערנו הזמנתך נדחתה"
    let line2 = "לצימר - " + order.zimmerName
    let line3 =  "ליחידה - " + order.hut_name
    let line4 = "בתאריך - " + order.start_date + " ועד לתאריך - " + order.end_date
    let line5 = "מספר אורחים: " + order.guests
    let line6 = " שם האורח - " + order.name
    let line7 = "מספר פלאפון - " + order.phone
    let line8 = "בקשות מיוחדות - "
    line8 += (order.requests ? order.requests: "אין")
    let line9 = "תוכלו לנסות וליצור בקשה חדשה"
    
    this.emailService.sendLongEmail(header, order.email, line1, line2, line3, line4, line5,
                                    line6, line7, line8, line9, "GoEasy")

  }
}
