import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faCalendar,
  faList,
  faPen,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from './../../models/event-model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent {
  @Input() eventDetails!: CalendarEvent | null;
  @Output() editClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter<CalendarEvent | null>();
  @Output() closeClicked = new EventEmitter();
  icons = {
    pen: faPen,
    delete: faTrash,
    close: faTimes,
    calendar: faCalendar,
    list: faList,
  };
  fallbackTitle: string = '<No Title>';

  onEditClicked(event: MouseEvent) {
    this.editClicked.emit({
      data: this.eventDetails,
      event,
    });
  }
  onDeleteClicked() {
    this.deleteClicked.emit(this.eventDetails);
  }
  onCloseClicked() {
    this.closeClicked.emit();
  }
}
