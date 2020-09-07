import {elements} from '../elements';

export const renderLeftPanel = (results, disp, page=1, resPerPage = 10) => {

        elements.recipeList.innerHTML = '';
        elements.pagination.innerHTML = '';
        
        const startItem = (page-1)*resPerPage;
        const maxPages = Math.ceil(results.length/resPerPage);

        for(let i = startItem; i < startItem + resPerPage && i < results.length; i++) {
            const recipeTitle = results[i].recipe.label.length > 20 ? results[i].recipe.label.slice(0,20)+'...': results[i].recipe.label;
            const vege = results[i].recipe.healthLabels.indexOf('Vegetarian') === -1? 'fas fa-bacon' : 'fas fa-seedling';
            const higlight = results[i].recipe.image === disp.img ? 'recipe__list__item--active': '';

            const markup = `<div class="recipe__list__item ${higlight}" data-id="${i}">
            <img src="${results[i].recipe.image}" alt="${results[i].recipe.label}" class="recpie__img">
            <div class="recipe__description">${i+1}. ${recipeTitle} <p class="recipe__small"> <i class="${vege}"></i> calories: ${Math.floor(results[i].recipe.calories)}, weight: ${Math.floor(results[i].recipe.totalWeight)}g </p>  </div>
            </div>`;
            
            elements.recipeList.insertAdjacentHTML('beforeend', markup);
        }
        if(+page === 1 && results.length > resPerPage) {
            renderButton(+page+1, 'next');
        } else if (+page === maxPages && results.length > resPerPage) {
            renderButton(+page-1, 'prev');
        } else if (results.length > resPerPage) {
            renderButton(+page-1, 'prev');
            renderButton(+page+1, 'next');
        }
    
    }

export const renderButton = (page, direction) => {
        let subMark;
        const arrow = direction === 'prev'? 'fas fa-arrow-left': 'fas fa-arrow-right';
        if(direction === 'prev') {
            subMark = 
            `Page ${page}
            <i class="${arrow}"></i>`;
        } else {
            subMark = 
            `<i class="${arrow}"></i>
            Page ${page}
            `;
        }
        const markup = `
        <button class="result__btn btn" data-goto="${page}">
        ${subMark}
        </button>`;
        elements.pagination.insertAdjacentHTML('beforeend', markup);
    }

export const renderMainPanel = (recipe, likedRecipes) => {
    const love = likedRecipes.filter(el => el.img === recipe.img).length ? 'loved' : ''
    elements.mainPanel.innerHTML = '';
    const ingredients = recipe.ingredients.map((el, index) => {
        const ingr = el.length > 120 ? el.slice(0, 117)+'...': el;
      return `<li class="ingredient ingredient-${index}"> <i class="far fa-check-square"></i> ${ingr} </li>`
    }).join(' ');
    
    const markup = `
    <figure class="recipe__fig">
    <img src=${recipe.img} alt="" class="recpie__fig__img">
    <h1 class="recipe__fig__title">
        ${recipe.title}
    </h1>
</figure>

<div class="recipe__details">
    <div class="recipe__info">
        <span class="recipe__servings"> <i class="fas fa-male"></i>  ${recipe.servings} servings</span>

        <span class="recipe__calories"> <i class="fas fa-hamburger"></i> ${recipe.calories} kcal</span>

        <span class="recipe__weight"><i class="fas fa-balance-scale"></i> ${recipe.weight} g</span>

        <span class="recipe__favourite"><i class="fas fa-heart small-like ${love}"></i></span>
    </div>
    <ul class="recipe__ingredients">
        <h2 class="recipe__ingredients__title">Ingredients</h2>
        ${ingredients}
    </ul>
</div>
<div class="recipe__directions">
    <a class="how__to_cook btn" href=${recipe.howToCook} target="_blank"> <i class="fas fa-route"></i> How to cook it ?</a>
    <button class="add__to__list btn"><i class="fas fa-shopping-basket"></i> Add to list</button>
</div>
    `;
    elements.mainPanel.insertAdjacentHTML('afterbegin', markup);
}

export const addToShoppingList = (ingredients) => {
    let markup =``;
    ingredients.forEach((el) => {
        markup += `<li class="item" data-id=${el.id}> <i class="fas fa-trash-alt"></i> ${el.text} </li>`;
    })
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
}

export const deleteIngredient = (id) => {
    const item = document.querySelector(`[data-id="${id}"]`);
    item.parentElement.removeChild(item);
}

export const updateLikedRecipesList = (recipes) => {
    elements.dropdown.innerHTML = ``;
    let markup = ``;
    for(const recipe of recipes) {
        const recipeTitle = recipe.title.length > 17 ? recipe.title.slice(0,17)+'...': recipe.title;
        const vege = recipe.healthLabels.indexOf('Vegetarian') === -1? 'fas fa-bacon' : 'fas fa-seedling';
        markup += `<li class="liked_recipe_item" data-recipeid=${recipe.img}>
        <img src=${recipe.img} alt="" class="recipe__item__img">
        <div class="recipe__item__description"> <p> ${recipeTitle} <i class="${vege}"></i></p>  <p class="recipe__item__small"> kcal: ${recipe.calories} <br> wgt: ${recipe.weight}g </p>  </div>
        </li>`;
    }
    elements.dropdown.insertAdjacentHTML('afterbegin', markup)
}