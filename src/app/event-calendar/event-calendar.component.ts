import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { EventService } from '../core/service/event.service';
import { CalendarEvent } from './../models/event-model';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css'],
})
export class EventCalendarComponent implements OnInit {
  @ViewChild('addEventWrapper', { static: false }) addEventWrapper!: ElementRef;

  eventsByDate: { [date: string]: CalendarEvent[] } = {};
  selectedEvent: CalendarEvent | null = null;
  eventDetails: CalendarEvent | null = null;
  isNewEvent: boolean = true;
  currentMonth: string = '';
  daysInMonth: number[] = [];
  selectedDate!: number;
  showMoreList: CalendarEvent[] = [];
  // Variables for drag and drop functionality
  isDragging: boolean = false;
  dragEvent: CalendarEvent | null = null;
  mouseEvent!: MouseEvent;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventsByDate = this.groupEventsByDate(
      this.eventService.getAllEvents()
    );
    this.setCurrentMonth();
  }

  openEventDialog(event: MouseEvent): void {
    this.selectedEvent = this.initializeEvent();
    this.isNewEvent = true;
    this.showAddEventDialog(event, -1);
  }

  initializeEvent(day: number | null = null): CalendarEvent {
    return {
      id: this.generateEventId(),
      title: '',
      date: new Date(
        new Date(this.currentMonth).getFullYear(),
        new Date(this.currentMonth).getMonth(),
        day ? day + 1 : new Date().getDate()
      ),
    };
  }

  saveEvent(event: CalendarEvent): void {
    if (this.isNewEvent) {
      event.id = this.generateEventId(); // Generate a unique ID for the event
      this.eventService.addEvent(event);
    } else {
      this.eventService.updateEvent(event);
    }
    this.selectedEvent = null;
    const eventWrapperElement = this.addEventWrapper.nativeElement;
    eventWrapperElement.style.display = 'none';
    this.eventsByDate = this.groupEventsByDate(
      this.eventService.getAllEvents()
    );
  }

  onEventClicked(event: MouseEvent, eventItem: CalendarEvent, day: number) {
    this.setMouseEvent(event);
    this.showMoreList = [];

    this.eventDetails = { ...eventItem };
    this.selectedEvent = null;
    this.setDialoguePosition();
    this.selectedDate = day;
  }
  onShowMoreEvent(eventData: { data: CalendarEvent; event: MouseEvent }) {
    const event = eventData.event;
    this.showMoreList = [];

    this.eventDetails = { ...eventData.data };
    this.selectedEvent = null;
    this.setDialoguePosition();
  }

  editEvent(event: { data: CalendarEvent; event: MouseEvent }) {
    if (event) {
      this.selectedEvent = { ...event.data };
      this.isNewEvent = false;
      this.showAddEventDialog(event.event, -1);
    }
  }

  deleteEvent(event: CalendarEvent | null): void {
    if (confirm('Are you sure you want to delete this event?') && event) {
      this.eventService.deleteEvent(event);
      this.selectedEvent = null;
      this.eventsByDate = this.groupEventsByDate(
        this.eventService.getAllEvents()
      );
      this.setCurrentMonth();
      this.closeAddEvent();
    }
  }

  setCurrentMonth(): void {
    const currentDate = new Date();
    this.currentMonth = format(currentDate, 'MMMM yyyy');
    this.daysInMonth = this.getDaysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
  }

  previousMonth(): void {
    const currentDate = new Date(this.currentMonth);
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.currentMonth = format(currentDate, 'MMMM yyyy');
    this.daysInMonth = this.getDaysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
  }

  nextMonth(): void {
    const currentDate = new Date(this.currentMonth);
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.currentMonth = format(currentDate, 'MMMM yyyy');
    this.daysInMonth = this.getDaysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
  }

  getDaysInMonth(month: number, year: number): number[] {
    const daysInMonth: number[] = [];
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      daysInMonth.push(i);
    }
    return daysInMonth;
  }

  groupEventsByDate(events: CalendarEvent[]): {
    [date: string]: CalendarEvent[];
  } {
    const eventsByDate: { [date: string]: CalendarEvent[] } = {};
    for (const event of events) {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = [];
      }
      eventsByDate[eventDate].push(event);
    }
    return eventsByDate;
  }

  getDateKey(day: number): string {
    const currentDate = new Date(this.currentMonth);
    currentDate.setMonth(currentDate.getMonth());
    currentDate.setDate(day + 1);
    return currentDate.toISOString().split('T')[0];
  }

  showAddEventDialog(event: MouseEvent, day: number) {
    this.eventDetails = null;
    this.showMoreList = [];
    // To show the dialog on the day div position
    if (day > 0) {
      this.setMouseEvent(event);
    }
    if (this.addEventWrapper && this.selectedDate !== day) {
      this.setDialoguePosition();
    }
    if (this.isNewEvent) {
      this.selectedEvent = this.initializeEvent(day);
    } else {
      if (this.selectedEvent) this.eventService.updateEvent(this.selectedEvent);
    }

    this.selectedDate = day;
  }

  closeAddEvent() {
    if (this.addEventWrapper && this.addEventWrapper.nativeElement) {
      const eventWrapperElement = this.addEventWrapper.nativeElement;
      eventWrapperElement.style.opacity = '0';
      setTimeout(() => {
        eventWrapperElement.style.display = 'none';
        eventWrapperElement.style.opacity = '1';
      }, 300);
    }
    this.selectedDate = 0;
  }

  dragStart(event: DragEvent, draggedEvent: CalendarEvent): void {
    this.isDragging = true;
    this.dragEvent = draggedEvent;
    event.dataTransfer!.setData('text', ''); // Required for Firefox
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  drop(event: DragEvent, date: string): void {
    event.preventDefault();
    if (this.isDragging && this.dragEvent) {
      this.dragEvent.date = new Date(date);
      this.eventService.updateEvent(this.dragEvent);
      this.eventsByDate = this.groupEventsByDate(
        this.eventService.getAllEvents()
      );
    }
    this.isDragging = false;
    this.dragEvent = null;
  }

  generateEventId(): number {
    return Math.floor(Math.random() * 1000);
  }

  onShowMoreClicked(day: number, event: MouseEvent) {
    this.setMouseEvent(event);
    this.eventDetails = null;
    this.selectedEvent = null;
    this.showMoreList = this.eventsByDate[this.getDateKey(day)];
    this.setDialoguePosition();
  }

  private setMouseEvent(event: MouseEvent) {
    event.stopPropagation();

    this.mouseEvent = event;
  }

  private setDialoguePosition() {
    let left = '40%';
    let top = '40%';
    if (this.mouseEvent) {
      left = this.mouseEvent.clientX + 'px';
      top = this.mouseEvent.clientY + 'px';
    }
    const eventWrapperElement = this.addEventWrapper.nativeElement;
    eventWrapperElement.style.display = 'block';
    eventWrapperElement.style.left = left;
    eventWrapperElement.style.top = top;
    eventWrapperElement.style.transform = 'translateY(100%)';
    setTimeout(() => {
      eventWrapperElement.style.transform = 'translateY(0)';
    }, 10);
  }
}
