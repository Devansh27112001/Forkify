import * as model from './model.js';
// This is a default export and hence we can use any of the methods using recipeView.method_name
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    //Rendering the spinner
    recipeView.renderSpinner();
    // 0)Update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Updating the bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe- sending the id to fetch the recipe accordingly to the id and then it will change the state variable in the model.js by storing the recipe info. in the state.recipe.
    await model.loadRecipe(id);

    // 3) Rendering the receipe- Using the changed state variable, we will send the state.recipe to recipeView and this will store the receipe in the #data variable in the recipeView.js
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) Get search query by using the method in searchView.
    const query = searchView.getQuery();
    if (!query) return;
    //2) this below method is not returning anything and hence we are not storing it in any variable. It is just updating the state variable.
    await model.loadSearchResults(query);
    //3) Render the results: this will show the results according to RESULTS_PER_PAGE.
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render initial pagination button: This will render the page buttons according to the page
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (gotToPage) {
  //3) Render the New results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(gotToPage));

  //4) Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings in the state
  model.updateServings(newServings);

  // Update the recipe view as well
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) Update recipe view
  recipeView.update(model.state.recipe);
  //3) Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  //For showing the single receipe according to the id
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  //For getting multiple recipes according to the search
  searchView.addHandlerSearch(controlSearchResults);

  //For controlling pagination.
  paginationView.addHandlerClick(controlPagination);
};
init();
