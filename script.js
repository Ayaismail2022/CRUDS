let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp; // لتخزين الـ index عند التعديل

// ------------------------------------------------------------------------------------------------------------------------
// Get Total Price
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result.toFixed(2); // تنسيق الرقم العشري
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#a00";
  }
}

// ------------------------------------------------------------------------------------------------------------------------
// Create Product

let dataPro;
// Check if localStorage has products, otherwise initialize an empty array
if (localStorage.product != null) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  // Validation
  if (
    title.value.trim() != "" &&
    price.value.trim() != "" &&
    category.value.trim() != "" &&
    newPro.count > 0 &&
    newPro.count < 100
  ) {
    if (mood === "create") {
      // If count is greater than 1, add multiple products
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      // mood === 'update'
      dataPro[tmp] = newPro; // Update the product at the stored index
      mood = "create"; // Reset mood to create
      submit.innerHTML = "Create"; // Reset button text
      count.style.display = "block"; // Show count input again
    }
    clearData(); // Clear input fields after creating/updating
    title.focus(); // Focus on title input for next entry
  } else {
    alert(
      "Please fill in all required fields (Title, Price, Category) and ensure Count is between 1 and 99."
    );
  }

  // Save data to localStorage
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData(); // Refresh the table to show updated data
};

// ----------------------------------------------------------------------------------------------------------------------------
// Clear Input Fields
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  total.style.background = "#a00"; // Reset total background color
  count.value = "";
  category.value = "";
}

// ---------------------------------------------------------------------------------------------------
// Read (Display) Data
function showData() {
  getTotal(); // Update total display even if no input is changed
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>
        `;
  }
  document.getElementById("tbody").innerHTML = table;

  let btnDeleteAll = document.getElementById("deleteAll"); // Corrected variable name
  if (dataPro.length > 0) {
    btnDeleteAll.innerHTML = `
        <button onclick="deleteAll()">Delete All (${dataPro.length})</button>
        `;
  } else {
    btnDeleteAll.innerHTML = "";
  }
}
showData(); // Call showData initially to display any existing products

// -----------------------------------------------------------------------------------------------------------------------
// Delete Data
function deleteData(i) {
  dataPro.splice(i, 1); // Remove one item at index 'i'
  localStorage.product = JSON.stringify(dataPro); // Update localStorage
  showData(); // Refresh the table
}

function deleteAll() {
  if (confirm("Are you sure you want to delete all products?")) {
    // Confirmation dialog
    localStorage.clear(); // Clear all localStorage
    dataPro.splice(0); // Clear the dataPro array
    showData(); // Refresh the table
  }
}

// ---------------------------------------------------------------------------------------
// Update Data
function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal(); // Recalculate total immediately
  count.style.display = "none"; // Hide count input during update
  category.value = dataPro[i].category;
  submit.innerHTML = "Update"; // Change button text to Update
  mood = "update"; // Set mood to update
  tmp = i; // Store the index of the item being updated
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// ------------------------------------------------------------------------------------------------------
// Search Functionality
let searchMood = "title";
let searchInput = document.getElementById("search"); // Get search input once

function getSearchMood(id) {
  // Pass 'id' of the clicked button
  if (id === "searchTitle") {
    // Use strict equality (===)
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  searchInput.placeholder = "Search By " + searchMood;
  searchInput.focus();
  searchInput.value = ""; // Clear search input when changing mood
  showData(); // Show all data again when changing search mood
}

function searchData(value) {
  // Pass 'value' from onkeyup event
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (searchMood === "title") {
      if (dataPro[i].title.includes(value.toLowerCase())) {
        table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>
                `;
      }
    } else {
      // searchMood === 'category'
      if (dataPro[i].category.includes(value.toLowerCase())) {
        table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
                </tr>
                `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}
