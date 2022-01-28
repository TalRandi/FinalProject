import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AngularCounterModule } from 'angular-input-counter';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { DataStorageService } from './shared-data/data-storage.service';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ZimmerListComponent } from './zimmer/zimmer-list/zimmer-list.component';
import { ZimmerDetailsComponent } from './zimmer/zimmer-details/zimmer-details.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ZimmerComponent } from './zimmer/zimmer.component';
import { CreateZimmerComponent } from './create-zimmer/create-zimmer.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PendingRequestsComponent } from './pending-requests/pending-requests/pending-requests.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ZimmerListComponent,
    ZimmerDetailsComponent,
    ControlPanelComponent,
    SearchBarComponent,
    ZimmerComponent,
    CreateZimmerComponent,
    ContactUsComponent,
    PendingRequestsComponent
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
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    NgxDropzoneModule,
    MatTabsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [DataStorageService, {provide: BUCKET, useValue: 'goeasy-5d966.appspot.com'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

