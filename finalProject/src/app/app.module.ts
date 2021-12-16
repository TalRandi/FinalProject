import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AngularCounterModule } from 'angular-input-counter';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ZimmerService } from './shared-data/zimmer.service';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ZimmerListComponent } from './zimmer-list/zimmer-list.component';
import { ZimmerDetailsComponent } from './zimmer-details/zimmer-details.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ZimmerListComponent,
    ZimmerDetailsComponent,
    ControlPanelComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    AngularCounterModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [ZimmerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
