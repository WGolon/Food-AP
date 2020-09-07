
export default class Recipe {
    constructor(recipe) {
        this.ingredients = recipe.ingredientLines;
        this.title = recipe.label;
        this.calories = Math.floor(recipe.calories);
        this.weight = Math.floor(recipe.totalWeight);
        this.servings = recipe.yield;
        this.img = recipe.image;
        this.label = recipe.label;
        this.howToCook = recipe.url;
        this.healthLabels = recipe.healthLabels;
    }


}