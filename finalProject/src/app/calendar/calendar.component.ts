import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataStorageService } from '../shared-data/data-storage.service';
import { Zimmer } from '../shared-data/zimmer.model';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Hut } from '../shared-data/hut.model';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {

  isLoading = false;
  my_zimmer: Zimmer[];
  selectedIndex = 0;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();

  constructor(private storage: DataStorageService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.storage.fetchAcceptedZimmers().pipe(finalize(() => this.isLoading = false)).subscribe(zimmers => {
      this.my_zimmer = zimmers.filter(zimmer => zimmer.zimmer_id == this.authService.zimmer.zimmer_id);

      if(this.my_zimmer[0]){
        this.my_zimmer[0].huts.forEach(hut => {
          if(hut.events){
            hut.events.forEach(event => {
              event.start =  parseISO(event.start.toString())
              event.end =  parseISO(event.end ? event.end.toString() : "")
            });
          }
        });
      }

    })  
  }


  eventTimesChanged(hut: Hut, {
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    hut.events = hut.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  addEvent(hut: Hut): void {
    if(!hut.events){
      hut.events = [];
    }
    hut.events = [
      ...hut.events,
      {
        id: "ownerEvent",
        title: '',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: {
          primary: '#041C32',
          secondary: '#ECB365',
        },
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  onStoreEvents(){
    this.isLoading = true;
    this.storage.updateZimmer(this.my_zimmer[0]).pipe(finalize(() => this.isLoading = false)).subscribe()
  }

  deleteEvent(eventToDelete: CalendarEvent, hut: Hut) {
    hut.events = hut.events.filter((event) => event !== eventToDelete);
  }

}
