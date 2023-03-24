// container
const list = document.querySelector("#meals");

// Favourites item list
const btn_favourites = document.querySelector("#favourites");
const favourites_list = document.querySelector(".favourites-list");
const input = document.querySelector("input");
const btn_search = document.querySelector("#search");

// setting local storeage for holding favourites items;
let local_storage_key = "Favourites_items";
let cur_item = "present_item";

// if the page refresh check if there are any elements present in localstorage. if present render else add them
let check = JSON.parse(localStorage.getItem(local_storage_key));
if (!check) localStorage.setItem(local_storage_key, JSON.stringify([]));

let hasItem = localStorage.getItem(cur_item);
if (!hasItem) localStorage.setItem(cur_item, "");
else {
  let present_item = localStorage.getItem(cur_item);
  fetchMeal(present_item);
  input.value = present_item;
}

//fetching meals;
let Meals;
async function fetchMeal(name) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`
  );
  const data = await response.json();
  if (data.meals) {
    Meals = data.meals;
    Meals.forEach(createAndAppend);
  }
}

// a function to create a card containing meal information
function createCard(meal) {
  // creating a data attribute which holds meal information ;
  let name = meal.strMeal.split(" ").join("_");
  let img_src = meal.strMealThumb;
  let favourites_arr = JSON.parse(localStorage.getItem(local_storage_key));
  let isPresent = favourites_arr.find((el) => el.name == name);
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("col-md-10");
  card.classList.add("col-11");
  card.classList.add("shadow");
  card.innerHTML = ` 
  <div class="card-header border-0 d-flex align-items-center justify-content-between">
  <span class="item-name h5 me-1">${meal.strMeal.slice(0, 16)}</span>
   <i class="fa fa-star 
   ${
     isPresent ? "add-to-favourites" : ""
   }" data-el-name=${name} data-el-src=${img_src}
   ></i>
  </div>
  <div class="card-body">
    <img src=${meal.strMealThumb} class="" 
    alt=${meal.strMeal} height="100%" width="100%"/>
  </div>
  <a href="info.html" data-el-name=${name} data-el-src=${img_src} class="card-footer border-0">about item</a>
  `;
  return card;
}

// a callback function which appends/renders the meals cards on main page
function createAndAppend(meal) {
  const card = createCard(meal);
  list.append(card);
}

// function for input change handling
btn_search.addEventListener("click", (e) => {
  list.innerHTML = ``;
  let val = input.value;
  localStorage.setItem(cur_item, val);
  fetchMeal(val);
});

// a function to add and remove items form favourites list through event deligation;
document.addEventListener("click", (e) => {
  // check current target has the required class or not
  if (e.target.classList.contains("fa-star")) {
    e.target.classList.toggle("add-to-favourites");
    let name = e.target.getAttribute("data-el-name");
    let img_src = e.target.getAttribute("data-el-src");
    // check that current item already present in list or not if present remove from favourites else push to favourites
    let favourites_arr = JSON.parse(localStorage.getItem(local_storage_key));
    let index = favourites_arr.findIndex((el) => el.name === name);
    if (index != -1) {
      let res = favourites_arr.filter((el, i) => i != index);
      favourites_arr = res;
    } else {
      favourites_arr.push({
        name,
        img_src,
      });
    }

    localStorage.setItem(local_storage_key, JSON.stringify(favourites_arr));
  }

  // check if clicked on delete icon or not .if clicked delete item and re render list else none
  if (e.target.classList.contains("fa-trash")) {
    let name = e.target.id;
    let favourites_arr = JSON.parse(localStorage.getItem(local_storage_key));
    let res = favourites_arr.filter((item) => item.name != name);
    localStorage.setItem(local_storage_key, JSON.stringify(res));
    favourites_list.innerHTML = "";
    list.innerHTML = "";
    let searched_item = localStorage.getItem(cur_item);
    fetchMeal(searched_item);
    render_favourites();
  }

  //
  if (e.target.classList.contains("card-footer")) {
    let name = e.target.getAttribute("data-el-name");
    let src = e.target.getAttribute("data-el-src");
    let about = {
      name,
      src,
    };
    localStorage.setItem("about", JSON.stringify(about));
  }
});

// a function which renders favourites items on offcanvas
btn_favourites.addEventListener("click", (e) => {
  favourites_list.innerHTML = ``;
  render_favourites();
});

// a function which creates a card for the favourites items which renders on offcanvas
function render_favourites() {
  let favourites_arr = JSON.parse(localStorage.getItem(local_storage_key));
  favourites_arr.forEach((item) => {
    let item_name = item.name;
    let src = item.img_src;
    let list_item = document.createElement("div");
    list_item.classList.add("list-group-item");
    list_item.classList.add("canvas-item");
    list_item.classList.add("shadow");
    list_item.innerHTML = `
    <img src=${src} height="70vh" width="70vh"/> 
    <span>${item_name}</span>
    <i class="fa fa-trash" id=${item.name}></i>
    `;
    favourites_list.append(list_item);
  });
}
