import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';

import * as sla from './store/shopping-list.actions'
import * as fromApp from '../store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  //private ingChangeSub: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }


  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
    
    /*this.ingredients = this.shoppingListService.getIngredients();
    this.ingChangeSub = this.shoppingListService.ingredientChanges
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );*/
  }

  ngOnDestroy() {
  //  this.ingChangeSub.unsubscribe();
  }

  onEditItem(i: number) {
    //this.shoppingListService.startedEditing.next(i);
    this.store.dispatch(new sla.StartEdit(i))
  }
}
