import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { EventDetailComponent } from './widget/event-detail/event-detail.component';
import { CreateEventComponent } from './widget/create-event/create-event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowMoreComponent } from './widget/show-more/show-more.component';

@NgModule({
  declarations: [AppComponent, EventCalendarComponent, EventDetailComponent, CreateEventComponent, ShowMoreComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
