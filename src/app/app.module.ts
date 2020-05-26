import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { InjectorComponent } from './modules/injector/injector.component';
import { MyInjectorComponent } from './modules/my-injector/my-injector.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    InjectorComponent,
    MyInjectorComponent,
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
