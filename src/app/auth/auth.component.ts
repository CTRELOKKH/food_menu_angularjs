import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true
  error: string = null
  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
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
      authOns = this.authService.login(email, password)
    }else{
      authOns = this.authService.signup(email, password)
    }

    authOns.subscribe(respData=>{
      console.log(respData)
      this.router.navigate(['/recipes'])
    },
    errorMessage=>{
      
      this.error= errorMessage
      
    })
    form.reset()
  }



}
