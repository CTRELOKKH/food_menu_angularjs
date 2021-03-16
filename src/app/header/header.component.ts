import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

import * as fromApp from '../store/app.reducer'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private datass:DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }
    isAuth = false
    private userSub: Subscription 

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe( user => {
      this.isAuth = !!user
    })

    /*
    this.userSub = this.authService.user.subscribe( user => {
      this.isAuth = !!user
    })
     */
  }

  ngOnDestroy(){
    this.userSub.unsubscribe()
  }

  onSaveClick(){
    this.datass.storeRecipes()
  }

  onFetchClick(){
    this.datass.fetchRecipes().subscribe()
  }

  onLogout(){
    this.authService.logout()
  }
  

}
