import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { ShoppingListService } from '../shopping-list.service';

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
  editedItemIndex: number;
  editingItem: Ingredient;

  @ViewChild('f', { static: false }) slForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editingItem = this.shoppingListService.getIngredient(this.editedItemIndex);
        this.slForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount
        })
      }
    );
  }

  onAddClicked(form: NgForm) {
    if (!this.editMode)
      this.shoppingListService.addIngredient(new Ingredient(form.value.name, Number(form.value.amount)))
    else
      this.shoppingListService.updateIngredient(this.editedItemIndex, new Ingredient(form.value.name, Number(form.value.amount)))

    this.formReset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formReset() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.formReset();
  }


}
