import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true
  error: string = null
  isLoading = false
  show: any;
  alertHost: any;
  closeSub: any;
  
  constructor(private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.authError

      if (this.error){
        alert(this.error);
      }
    })
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  closeErrorWindow(){
    this.error = null
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return
    }
    const email=form.value.email
    const password=form.value.password

    let authOns: Observable<AuthResponseData>
    if(this.isLoginMode){
      //authOns = this.authService.login(email, password)
      this.store.dispatch( new AuthActions.LoginStart({email, password}))
    }else{
      authOns = this.authService.signup(email, password)
    }
   
    
  /*  authOns.subscribe(respData=>{
      console.log(respData)
      this.router.navigate(['/recipes'])
    },
    errorMessage=>{
      
      this.error= errorMessage
      
    })*/
    form.reset()
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }



}
