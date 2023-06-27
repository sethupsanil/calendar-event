import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from './../../models/event-model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnChanges {
  @Input() selectedEvent!: CalendarEvent | null;
  @Output() saveEvent = new EventEmitter<CalendarEvent>();
  @Output() closeAddEvent = new EventEmitter();
  close = faTimes;
  formattedDate: string = '';

  ngOnChanges() {
    if (this.selectedEvent && this.selectedEvent.date) {
      this.formattedDate = new Date(this.selectedEvent.date)
        .toISOString()
        .split('T')[0];
    }
  }

  onCloseClicked() {
    this.closeAddEvent.emit();
  }
  onSave(event: CalendarEvent) {
    event.date = new Date(this.formattedDate);
    this.saveEvent.emit(event);
  }
}
