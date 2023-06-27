import { Injectable } from '@angular/core';
import { CalendarEvent } from './../../models/event-model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: CalendarEvent[] = [];

  constructor() {
    this.loadEventsFromLocalStorage();
  }

  getAllEvents(): CalendarEvent[] {
    return this.events;
  }

  addEvent(event: CalendarEvent): void {
    this.events.push(event);
    this.saveEventsToLocalStorage();
  }

  updateEvent(event: CalendarEvent): void {
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      this.events[index] = event;
      this.saveEventsToLocalStorage();
    }
  }

  deleteEvent(event: CalendarEvent): void {
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.saveEventsToLocalStorage();
    }
  }

  private loadEventsFromLocalStorage(): void {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents) as CalendarEvent[];
    }
  }

  private saveEventsToLocalStorage(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }
}
