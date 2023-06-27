import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from './../../models/event-model';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.css'],
})
export class ShowMoreComponent {
  @Output() closeEvent = new EventEmitter();
  @Output() eventBadgeClicked = new EventEmitter<{
    data: CalendarEvent;
    event: MouseEvent;
  }>();
  @Input() showMoreList: CalendarEvent[] = [];

  icon = faTimes;
  fallbackTitle: string = '<No Title>';

  onClickEvent(eventItem: CalendarEvent, event: MouseEvent) {
    this.eventBadgeClicked.emit({
      data: eventItem,
      event,
    });
  }

  onClickClose() {
    this.closeEvent.emit();
  }
}
