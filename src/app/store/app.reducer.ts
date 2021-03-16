import * as fromShoppongList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import { ActionReducerMap } from '@ngrx/store'

export interface AppState{
    shoppingList: fromShoppongList.State,
    auth: fromAuth.State
}


export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppongList.shoppingListReduer,
    auth: fromAuth.authReducer
}
