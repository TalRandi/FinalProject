import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
import { EmailService } from '../shared-data/email.service';
import { Order } from '../shared-data/order.model';


@Component({
  selector: 'app-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.css']
})

export class ClientOrdersComponent implements OnInit {
  @ViewChild('form') rate_form: NgForm;
  isLoading = false;
  client: Client;
  orders_index:boolean[] = []
  remaining_days: number[] = []

  constructor(private storage: DataStorageService, private _snackBar: MatSnackBar, private emailService: EmailService) { }

  ngOnInit(): void {
    
    this.isLoading = true;
    var userData = JSON.parse(localStorage.getItem('userData')!.toString());
    this.storage.getClient(userData.email).subscribe(client => {
      this.client = client;
      if(!this.client.orders){
        this.client.orders = [];
      }
      let today = new Date().getTime()
      for (let i = 0; i < this.client.orders.length; i++){
        this.orders_index.push(true) 
        let start_date = new Date(this.formatDate(this.client.orders[i].start_date)).getTime()
                
        this.remaining_days[i] = Math.round((start_date - today) / (1000 * 3600 * 24))
        console.log(this.client.orders[11].zimmerOwnerEmail);
        
      }
      
      this.isLoading = false; 
    }) 
  }

  onCancelOrder(order: Order, index: number): void{
    this.storage.cancelOrderOnBoth(order.order_id, order.points_used);
    if(order.points_used > 0){
      this._snackBar.open("ההזמנה בוטלה! הנקודות יחזרו לחשבונך בדקות הקרובות.", "אישור", {
        duration: 10000,
        panelClass: ['my-snackbar', 'login-snackbar'],
      });
    }
    else{
      this._snackBar.open("ההזמנה בוטלה!.", "אישור", {
        duration: 10000,
        panelClass: ['my-snackbar', 'login-snackbar'],
      });
    }
    if(order.isApproved){
      let header = order.email + "- שלום רב לבעלי הצימר "
      let line1 = "זוהי הודעה על ביטול הזמנה לאחר אישורך"
      let line2 = " מספר הזמנה - " + order.order_id
      let line3 = "לצימר - " + order.zimmerName
      let line4 =  "ליחידה - " + order.hut_name
      let line5 = " שם האורח - " + order.name
      let line6 = "מספר פלאפון - " + order.phone
      let line7 = "מתאריך - " + order.start_date + " ועד לתאריך - " + order.end_date
      
      this.emailService.sendLongEmail(header, order.zimmerOwnerEmail, line1, line2, line3, line4, line5,
                                      line6, line7, "", "", "GoEasy")
    }
    this.client.orders.splice(index, 1);
  }
  onRateZimmer(index: number){
    this.orders_index[index] = !this.orders_index[index]
  }
  onSubmit(order: Order, index: number){
    let client_rate = (this.rate_form.value.rate1 + this.rate_form.value.rate2 + this.rate_form.value.rate3) / 3;
    order.isRated = true;
    let new_points = Math.round(order.total_price * 0.1)
    this.client.points += new_points;
    this.storage.setRatedOnBoth(this.client, order.order_id, client_rate); 
    this.orders_index[index] = !this.orders_index[index]
    
    this._snackBar.open("הדירוג התקבל! " + new_points +" נקודות חדשות נוספו לחשבונך.", "אישור", {
      duration: 10000,
      panelClass: ['my-snackbar', 'login-snackbar'],
    });
  }

  formatDate(date: string){
    if(date == "") return ""

    let res = date.split('.');
    let temp = res[2]
    res[2] = res[0]
    res[0] = temp

    if(res[1].length < 2)
      res[1] = '0'+res[1]

    if(res[2].length < 2)
      res[2] = '0'+res[2]

    return res[0]+'/'+res[1]+'/'+res[2]
  }
}
