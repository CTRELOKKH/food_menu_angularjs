import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router:Router) { }
  recipeForm: FormGroup;


  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initFrom();
        }
      );
  }

  private initFrom() {
    let recName = '';
    let recImagePath = '';
    let recDesc = '';
    let recipeIngr = new FormArray([]);

    if (this.editMode) {
      const rec = this.recipeService.getRecipe(this.id);
      recName = rec.name;
      recImagePath = rec.imagePath;
      recDesc = rec.description;

      if (rec['ingredients']) {
        for (let ingredient of rec.ingredients) {
          recipeIngr.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recName, Validators.required),
      'imagePath': new FormControl(recImagePath, Validators.required),
      'description': new FormControl(recDesc, Validators.required),
      'ingredients': recipeIngr
    })
  }

  onSubmit() {
    const newRec = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRec);
    } else {
      this.recipeService.addRecipe(newRec);
    }
    this.router.navigate(['recipes']);
  }

  onCancel(){
    this.router.navigate(['recipes']);
  }

  onDelIng(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
   ;
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }
}
