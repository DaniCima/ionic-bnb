import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ScrollingModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
