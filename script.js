// Importing necessary modules from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration and initialization
const appSettings = {
  databaseURL: "https://native-web-app-3bb28-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "items");

// DOM element references
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Function to clear the input field
function clearInputFieldEl() {
  inputFieldEl.value = "";
}

// Function to clear the shopping list
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

// Function to append items to the shopping list
function appendItemToshoppingListEl(itemID, itemValue) {
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `items/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}

// Event listener for the add button
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

// Real-time listener for changes in the database
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (const [key, value] of itemsArray) {
      let currentItemID = key;
      let currentItemValue = value;
      appendItemToshoppingListEl(currentItemID, currentItemValue);
    }
  } else {
    shoppingListEl.textContent = "No items in the cart";
    shoppingListEl.style.fontSize = "20px";
  }
});
