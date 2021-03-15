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
import { shoppingListReduer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({shoppingList: shoppingListReduer}),
    AuthModule,
    CoreModule,
    ShoppingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
