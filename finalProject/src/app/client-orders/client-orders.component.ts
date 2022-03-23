import { Component, OnInit } from '@angular/core';
import { Client } from '../shared-data/client.model';
import { DataStorageService } from '../shared-data/data-storage.service';
import { Order } from '../shared-data/order.model';

@Component({
  selector: 'app-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.css']
})
export class ClientOrdersComponent implements OnInit {

  isLoading = false;
  client: Client;

  constructor(private storage: DataStorageService) { }

  ngOnInit(): void {
    this.isLoading = true;
    var userData = JSON.parse(localStorage.getItem('userData')!.toString());
    this.storage.getClient(userData.email).subscribe(client => {
      this.client = client;
      if(!this.client.orders){
        this.client.orders = [];
      }
      this.isLoading = false;
    }) 
  }

  onCancelOrder(order: Order, index: number): void{
    // TODO
  }

}
