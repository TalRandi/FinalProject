import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
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

  constructor(private storage: DataStorageService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoading = true;
    var userData = JSON.parse(localStorage.getItem('userData')!.toString());
    this.storage.getClient(userData.email).subscribe(client => {
      this.client = client;
      if(!this.client.orders){
        this.client.orders = [];
      }
      for (let i = 0; i < this.client.orders.length; i++)
        this.orders_index.push(true) 
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
    // TODO: Add the snackbar with informative message about the points: Math.round(order.total_price * 0.1)
    this._snackBar.open("הדירוג התקבל! " + new_points +" נקודות חדשות נוספו לחשבונך.", "אישור", {
      duration: 10000,
      panelClass: ['my-snackbar', 'login-snackbar'],
    });
  }
}
