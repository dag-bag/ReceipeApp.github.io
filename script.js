// "use strict";
const favoriteContainer = document.querySelector(".favMeals");
const mealBOx = document.querySelector("#meals");
getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respnData = await resp.json().then((data) => data);
  const RandomMeal = respnData.meals[0];
  addMeal(RandomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}
async function getMealBySearch(term) {
  // meals.innerHTML = "";
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await resp.json();

  const meal = respData.meals;
  console.log(meal);
  return meal;
}

const addMeal = (mealData, random = false) => {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
      <div class="mealHead">
      ${random ? `<h4 class="randomHead">Random Receipe</h4> ` : ""}
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
      </div>
      <div class="mealBody">
      <h4>
      ${mealData.strMeal}
      </h4>
      <button class="favBtn">
      <i class="far fa-heart"></i>
      </button>
      </div>
      `;
  const btn = meal.querySelector(".favBtn");
  btn.addEventListener("click", (e) => {
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }
    fetchFavMeals();
  });
  const mealHead = meal.querySelector(".mealHead");
  mealHead.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealBOx.appendChild(meal);
};

const addMealtoFav = (mealData) => {
  // favoriteContainer.innerHTML = "";

  const li = document.createElement("li");

  li.innerHTML = `
  <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span><button class="clear"><i class="fas fa-window-close"></i></button>
  `;
  const closeBtn = li.querySelector(".clear");
  closeBtn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeals();
  });
  const liIMG = li.querySelector("img");
  liIMG.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  favoriteContainer.appendChild(li);
};
function addMealLS(mealId) {
  // favoriteContainer.inneHTML = "";
  // favoriteContainer.innerHTML = "";
  favoriteContainer.innerHTML = "";
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  // clean the container
  favoriteContainer.innerHTML = "";
  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    let meal = await getMealById(mealId);

    addMealtoFav(meal);
  }
}
/**
 *@Search_BY_TERM
 */
const searchBtn = document.querySelector("#search");
const query = document.querySelector("#query");
searchBtn.addEventListener("click", async () => {
  // Clear the container
  mealBOx.innerHTML = "";
  const search = query.value;
  console.log("search:", search);
  const meals = await getMealBySearch(search);

  // meals.forEach(element => {
  //   addMeal(element)
  // });
  console.log(meals);
  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

/**
 * @mealINFORMATION
 */

const mealInfoContainer = document.querySelector(".mealInfoContainer");
const popupCOntainer = document.querySelector(".popUpContainer");
function showMealInfo(Mealdata) {
  mealInfoContainer.innerHTML = "";
  const newMealINfo = document.createElement("div");
  newMealINfo.classList.add("mealInfo");
  newMealINfo.setAttribute("id", "mealInfo");
  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (Mealdata["strIngredient" + i]) {
      ingredients.push(
        `${Mealdata["strIngredient" + i]} - ${Mealdata["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  newMealINfo.innerHTML = `
  
  <button class="closeMealInfo"><i class="fas fa-times"></i></button>
  <div class="mealHeader">
      <h1>${Mealdata.strMeal}</h1>
      <img src="${Mealdata.strMealThumb}" alt="${Mealdata.strMeal}">
  </div>
  <div class="mealFullText">
      <p>${Mealdata.strInstructions}</p>
      <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
              
        </ul>
    
  </div>
`;
  popupCOntainer.classList.remove("hidden");
  const closeMealInfo = newMealINfo.querySelector(".closeMealInfo");

  closeMealInfo.addEventListener("click", () => {
    popupCOntainer.classList.add("hidden");
  });

  mealInfoContainer.appendChild(newMealINfo);
}

// CLose icon For favraite container
const fullFabContainer = document.querySelector(".favContainer");
fullFabContainer.addEventListener("click", () => {
  fullFabContainer.classList.toggle("active");
});
