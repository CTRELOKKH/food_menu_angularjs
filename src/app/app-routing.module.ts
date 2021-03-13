import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {path: '', redirectTo:'/recipes', pathMatch: 'full'},
    {path: 'recipes',loadChildren: './recipes/recipes.module#RecipesModule'},
    
   
  // {path: '**', redirectTo:'/recipes', pathMatch: 'full'}
    
  ];

  @NgModule({
      imports: [
          RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
      ],
      exports:[
        RouterModule
      ]
  })
  export class AppRoutingModule{
      
  }