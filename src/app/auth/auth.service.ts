import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./user.model";


export interface AuthResponseData{
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: string
}

@Injectable({providedIn:'root'})
export class AuthService{

    user = new BehaviorSubject<User>(null)
    private tokenExpTimer: any
    
    
    constructor(private http:HttpClient, private router: Router){}
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIkey,
            {
                email:email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(respData =>{
                this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn)
            })
        )
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIkey,
            {
                email:email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(respData =>{
                this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn)
            })
        )
    } 

    logout(){
        this.user.next(null)
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
        if(this.tokenExpTimer){
            clearTimeout(this.tokenExpTimer)
        }
        this.tokenExpTimer = null

    }

    autoLogout(expirationDuration: number){
        this.tokenExpTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    private handleAuth(email: string, userID: string, token:string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn *1000)
        const user = new User(email, userID, token, expirationDate)
        this.user.next(user)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    autoLogin(){
        const userData: {
            email: string, 
            id: string,
            _token: string,
            _tokenExpirationDate: string
        }
         = JSON.parse(localStorage.getItem('userData'))
        if(!userData){
            return;
        }else{
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

            if (loadedUser.token){
                this.user.next(loadedUser)
                const expDur = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                this.autoLogout(expDur)
            }
        }
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = '?Unkwown error'
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'ThisEmailAlready'
                break
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'ThisEmailNotFound'
                break
        }
        return throwError(errorMessage)
    }
}