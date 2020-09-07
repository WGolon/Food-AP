import './styles/main.scss';
import {elements} from './js/elements';
import Search from './js/models/Search';
import List from './js/models/List'
import Recipe from './js/models/Recipe';
import {renderLeftPanel, renderMainPanel, addToShoppingList, deleteIngredient, updateLikedRecipesList} from './js/controllers/UI_Controller';
import { jsPDF } from "jspdf";


let state = {
    results:'',
    displayedRecipe: '',
    likedRecipes: [],
};

state.list = new List();

async function searchController(e) {
    elements.spinner.style.display = 'block';
    
    e.preventDefault();
    const search = new Search(elements.searchField.value);
    await search.getRecipes();
    state.results = search.results;
    elements.spinner.style.display = 'none';
    renderLeftPanel(state.results, state.displayedRecipe);
    // state.results = recipes;
    // renderLeftPanel(recipes, state.displayedRecipe);
}

function paginationController(e) {
    e.preventDefault();
    const btn = e.target.closest('.result__btn')
    if(btn) {
        const page = btn.dataset.goto;
        renderLeftPanel(state.results, state.displayedRecipe, page);
    }
}


function itemDetailsController(e) {
    const recipe = e.target.closest('.recipe__list__item');
    if(recipe) {
        const recipeToDisplay = state.results[recipe.dataset.id].recipe;
        if(state.displayedRecipe.img !== recipeToDisplay.image) {
            state.displayedRecipe = new Recipe(recipeToDisplay);
            renderMainPanel(state.displayedRecipe, state.likedRecipes);
            const highlighted = document.querySelector('.recipe__list__item--active');
            if(highlighted) {
                highlighted.classList.remove('recipe__list__item--active')
            }
            // document.querySelector('.recipe__list__item--active').classList.remove('.recipe__list__item--active');
            recipe.classList.add('recipe__list__item--active');
        }
    } else return;
}

function likedItemsController(e) {
    if(e.target === document.querySelector('.big-like') && state.likedRecipes.length){
        elements.dropdown.classList.toggle('display-none');
    }
}

function likedRecipeDisplay(e) {
    const id = e.target.closest('.liked_recipe_item').dataset.recipeid;
    if(state.displayedRecipe.img !== id) {
        state.displayedRecipe = state.likedRecipes.filter(el => el.img === id)[0];
        renderMainPanel(state.displayedRecipe, [...state.likedRecipes]);
        const highlighted = document.querySelector('.recipe__list__item--active');
        if(highlighted) highlighted.classList.remove('recipe__list__item--active');
        let toHiglight = document.querySelector(`.recipe__list__item img[src="${state.displayedRecipe.img}"]`);
        if(toHiglight) {
            toHiglight.parentNode.classList.add('recipe__list__item--active');
        }
    }
}

elements.searchBtn.addEventListener('click', searchController);
elements.pagination.addEventListener('click', paginationController);
elements.recipeList.addEventListener('click', itemDetailsController);
elements.favourites.addEventListener('click', likedItemsController);
elements.dropdown.addEventListener('click', likedRecipeDisplay)
elements.mainPanel.addEventListener('click', (e) => {
    if(e.target.closest('.add__to__list')) {
        const ingredients = [...state.displayedRecipe.ingredients];
        const ingredientsWithID = state.list.addIngredients(ingredients);
        addToShoppingList(ingredientsWithID);
    } else if(e.target.closest('.recipe__favourite')) {
        document.querySelector('.small-like').classList.toggle('loved');
        loveRecipeHandler(state.displayedRecipe);
        heartColorChange();
        updateLikedRecipesList([...state.likedRecipes]);
        if(state.likedRecipes.length <= 0){
            elements.dropdown.classList.add('display-none');
        }
    }
})
elements.shoppingListPanel.addEventListener('click', (e) => {
    if(e.target.matches('.generate__pdf__btn')) {
        if(state.list.items.length > 0) {
            const doc = new jsPDF();
            let yOffset = 35
            for(const item of state.list.items){
                doc.text(`- ${item.text}`, 20, yOffset);
                yOffset+=10;
            }
            doc.text('Shopping List:', 20, 20);
            doc.save("Shopping list.pdf");
        }
    } else if(e.target.matches('.add__ingredient__btn')) {
        e.preventDefault();
        const ingredient = document.querySelector('.add__ingredient__input').value;
        if(ingredient.length > 0) {
            state.list.addIngredients([ingredient]);
            addToShoppingList([state.list.items[state.list.items.length-1]]);
        }
    } else if(e.target.matches('.fa-trash-alt')) {
        const id = e.target.closest('.item').dataset.id;
        deleteIngredient(id);
        state.list.removeIngredient(id);
    }
})

function loveRecipeHandler(recipe) {
    if(state.likedRecipes) {
        let filteredArr = state.likedRecipes.filter(el => el.img !== recipe.img);
        if(filteredArr.length === state.likedRecipes.length) {
            state.likedRecipes.push(recipe)
        }else {
            state.likedRecipes = filteredArr;
        }
    } else {
        state.likedRecipes = [recipe]
    }
    localStorage.setItem('likedRecipes', JSON.stringify(state.likedRecipes))
}

function onFirstLoad() {
    const storedRcps = JSON.parse(localStorage.getItem('likedRecipes'));
    if(storedRcps) {
        state.likedRecipes = storedRcps;
    }
    heartColorChange();
    updateLikedRecipesList([...state.likedRecipes]);
}

function heartColorChange() {
    if(state.likedRecipes.length) {
        document.querySelector('.big-like').classList.remove('far');
        document.querySelector('.big-like').classList.add('fas');
    } else {
        document.querySelector('.big-like').classList.remove('fas');
        document.querySelector('.big-like').classList.add('far');
    }
}
onFirstLoad();