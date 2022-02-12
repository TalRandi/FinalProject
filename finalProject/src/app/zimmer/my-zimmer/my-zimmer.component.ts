import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-my-zimmer',
  templateUrl: './my-zimmer.component.html',
  styleUrls: ['./my-zimmer.component.css']
})
export class MyZimmerComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
