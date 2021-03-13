import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';

@Injectable()
export class ShoppingListService{
    exist:Boolean
    startedEditing = new Subject<number>();
    ingredientChanges = new Subject<Ingredient[]>();

    private ingredients:Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',10),
      ];

    addIngredient(ingredient:Ingredient){
        this.exist=false
        this.ingredients.forEach(element => {
            if(element.name==ingredient.name){
                element.amount+=ingredient.amount;
                this.exist=true;
            }
        });
        if(!this.exist){
            this.ingredients.push(ingredient);
        }
        this.ingredientChanges.next(this.ingredients.slice());
    }

    getIngredients(){
        return this.ingredients.slice();
    }

    getIngredient(n:number){
        return this.ingredients[n];
    }
    updateIngredient(n:number, newIngredient: Ingredient){
        this.ingredients[n] = newIngredient;
        this.ingredientChanges.next(this.ingredients.slice());
    }

    deleteIngredient(n:number){
        this.ingredients.splice(n,1);
        this.ingredientChanges.next(this.ingredients.slice());

    }
}