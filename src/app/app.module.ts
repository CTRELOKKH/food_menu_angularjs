import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './shared/alert/alert.component';
import { ShoppingModule } from './shopping-list/shopping.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth/auth.module';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    AuthModule,
    CoreModule,
    ShoppingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
