import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  providers:[]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients:Ingredient[];
  private ingChangeSub:Subscription;

  constructor(private shoppingListService:ShoppingListService) { }
  
  
  ngOnInit(): void {
    this.ingredients=this.shoppingListService.getIngredients();
    this.ingChangeSub = this.shoppingListService.ingredientChanges
    .subscribe(
      (ingredients: Ingredient[]) =>{
        this.ingredients=ingredients;
      }
    );
  }

  ngOnDestroy(){
    this.ingChangeSub.unsubscribe();
  }

  onEditItem(i: number){
    this.shoppingListService.startedEditing.next(i);
  }
}
