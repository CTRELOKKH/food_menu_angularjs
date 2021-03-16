import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.module';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  //  @Output() ingred=new EventEmitter<Ingredient>();
  amountInput: number;
  nameInput: string;
  subscription: Subscription;
  editMode = false;
//  editedItemIndex: number;
  editingItem: Ingredient;

  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex> -1){
        this.editMode = true
        this.editingItem= stateData.editedIngredient
        this.slForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount
        })
      } else {
        this.editMode = false
      }

    })
    /*this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editingItem = this.shoppingListService.getIngredient(this.editedItemIndex);
        this.slForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount
        })
      }
    )*/
  }

  onAddClicked(form: NgForm) {

    if (!this.editMode)
      this.store.dispatch(new ShoppingListActions.AddIngredient(new Ingredient(form.value.name, Number(form.value.amount))))

     // this.shoppingListService.addIngredient(new Ingredient(form.value.name, Number(form.value.amount)))
    else
     // this.shoppingListService.updateIngredient(this.editedItemIndex, new Ingredient(form.value.name, Number(form.value.amount)))
     this.store.dispatch(new ShoppingListActions.UpdateIngredient(new Ingredient(form.value.name, Number(form.value.amount))))

    this.formReset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  formReset() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    //this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredients())
    this.formReset();
  }


}
