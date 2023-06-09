const meals = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals');

const searchTerm = document.getElementById("searchterm");
const searchbtn = document.getElementById("search");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  
  addMeal(randomMeal, true);
}
  
async function getMealById(id){
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
  
  const respData = await resp.json();
  const meal = respData.meals[0]; 
  return meal;
    
}

async function getMealBySearch(term){
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
  
  const respData = await resp.json();
  const meals = respData.meals[0]; 
  return meals;
  console.log(meals);
} 

//create random meal-box dynamiclly................. 

function addMeal(mealData, random = false) //mealData me randomMeal (json) ka data h 
{
 const meal = document.createElement('div'); 
  meal.classList.add('meal');
  
  meal.innerHTML = `
        <div class="meal-header">
            ${random ? ` <span class="random"> Random Recipe </span>` : ""}
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"/>
        </div>
        
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div> `;
  
    const btn = meal.querySelector(".meal-body .fav-btn");
          btn.addEventListener("click", () => {
       if(btn.classList.contains('active')){
          removeMealLS(mealData.idMeal)
          btn.classList.remove("active");    
          // console.log(mealData.idMeal);
         fetchFavMeals();
         }else{
           addMealLS(mealData.idMeal); // localStorage pe random meal ki ID store ho jaye.
            btn.classList.add("active");
            // console.log(mealData.idMeal);
           fetchFavMeals();
         }
            
  });
  
   meals.appendChild(meal);
}




//now we have MealId, now you will store this id in localstorage..

function addMealLS(mealId){  // random meal ki ID here (54514)
  const mealIds = getMealsLS(); //Localstorage ki ids
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
  // console.log(mealIds);
  
}





function removeMealLS(mealId){
  const mealIds = getMealsLS();
  localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !==mealId))
  );
  const an = JSON.stringify(mealIds.filter((id) => id !==mealId));
  
   // localStorage.clear(an); 
}

function getMealsLS(){ 
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}



 async function fetchFavMeals(){
   
   favContainer.innerHTML ="";
  const mealIds = getMealsLS();
  const meals = []; 
   for(let i = 0; i < mealIds.length; i++){
     const mealId = mealIds[i];
     
     meal = await getMealById(mealId);
     
     addMealFav(meal);
   }
   // console.log(meals); 
}

//...............................................................................

function addMealFav(mealData) //mealData me randomMeal (json) ka data h 
{
 const favMeal = document.createElement('li');
  
  favMeal.innerHTML = `<img src="${mealData.strMealThumb}" 
                    alt="${mealData.strMeal}">
                    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fa-sharp fa-regular fa-circle-xmark"></i></button>`;

  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", ()=>{
    removeMealLS(mealData.idMeal);
    
    fetchFavMeals();
    
  });
  
   favContainer.appendChild(favMeal);
}

searchbtn.addEventListener("click", async ()=>{
   const search = searchTerm.value;
   
   const meals = await getMealBySearch(search);
  
    addMeal(meals); 

}); 