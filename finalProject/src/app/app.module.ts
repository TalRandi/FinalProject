import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoadingSpinnerComponent } from './shared-data/loading-spinner/loading-spinner.component';
import { MyZimmerComponent } from './zimmer/my-zimmer/my-zimmer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ZimmerOrdersComponent } from './zimmer-orders/zimmer-orders.component';
import { ClientOrdersComponent } from './client-orders/client-orders.component';
import { ClientFavoritesComponent } from './client-favorites/client-favorites.component';
import { AutosizeModule } from 'ngx-autosize';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { RoundPipe } from './zimmer/zimmer-list/zimmer-list.component'


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
    PendingRequestsComponent,
    AuthenticationComponent,
    LoadingSpinnerComponent,
    MyZimmerComponent,
    NotFoundComponent,
    ImageCarouselComponent,
    SignUpComponent,
    ZimmerOrdersComponent,
    ClientOrdersComponent,
    ClientFavoritesComponent,
    ForgotPasswordComponent,
    CalendarComponent,
    RoundPipe,
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
    MatSnackBarModule,
    MatRadioModule,
    MatExpansionModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    MatTabsModule,
    AutosizeModule,
    GooglePlaceModule,
    AgmCoreModule,
    MatAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCDYjSXe1aB3qzPgxWO2pYIBoJX_OSaZTY', libraries: ["places"]
  }),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [{provide: BUCKET, useValue: 'goeasy-5d966.appspot.com'}, { provide: MAT_DATE_LOCALE, useValue: 'HE' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

