import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }
    addIngredients(ingredients) {
        for(let ingredient of ingredients) {
            this.items.push({
                text: ingredient,
                id: uniqid(),
            })
        }
        return this.items.slice(this.items.length - ingredients.length);
    }
    removeIngredient(id) {
        this.items = this.items.filter(el => {
            return el.id !== id;
        })
    }
}