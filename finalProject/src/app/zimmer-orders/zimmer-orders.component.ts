import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataStorageService } from '../shared-data/data-storage.service';
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

  constructor(private storage: DataStorageService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().subscribe(result => {   
      this.my_zimmer = result.filter(zimmer => zimmer.zimmer_id == this.authService.zimmer.zimmer_id);
      if(this.my_zimmer[0].orders){
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

  onSubmitOrder(order: Order, index: number){
    if(this.my_zimmer[0].orders){
      this.my_zimmer[0].orders.forEach(stored_order => {
        if(stored_order.order_id == order.order_id){
          stored_order.isApproved = true;
          this.storage.approveOrder(this.my_zimmer[0]).subscribe();
        }
      })
    }
    order.isApproved = true;
    this.orders.splice(index, 1);
    this.orders_archive.push(order);
  }


}
