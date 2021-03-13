import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private datass:DataStorageService,
    private authService: AuthService) { }
    isAuth = false
    private userSub: Subscription 

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      this.isAuth = !!user
    })
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
