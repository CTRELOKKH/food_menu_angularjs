import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, switchMap, map, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

import * as AuthAction from './auth.actions'


export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: string
}

@Injectable()
export class AuthEffects {

    authLogin = createEffect((): any => this.actions$.pipe(
        ofType(AuthAction.LOGIN_START),
        switchMap((authData: AuthAction.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
                + environment.firebaseAPIkey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(respData => {
                    const expirationDate = new Date(new Date().getTime() + + respData.expiresIn * 1000)

                    return new AuthAction.Login({ email: respData.email, userId: respData.localId, token: respData.idToken, expirationDate: expirationDate })
                }),
                catchError(
                    errorRes => {
                        let errorMessage = '?Unkwown error'
                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'ThisEmailAlready'
                                break
                            case 'EMAIL_NOT_FOUND':
                                errorMessage = 'ThisEmailNotFound'
                                break
                        }

                        return of(new AuthAction.LoginFail(errorMessage))
                    }
                )
            )
        }),


    ))

    authSuccess = createEffect(() => this.actions$.pipe(ofType(AuthAction.LOGIN), tap(() => {
        this.router.navigate(['/'])
    })), { dispatch: false })

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}