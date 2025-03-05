+++
title = "Standard Drink Calculator"
description = "A simple U.S. standard drink calculator"
authors = ["Wolfgang"]
weight = 1
date =  2024-01-14
updated = 2025-03-04
+++
# Standard Drink Calculator
## A U.S. standard drink calculator
<!-- This tool uses JavaScript and is useless in plaintext. -->

<form id="drink-form">
    <table id="drink-table">
        <thead>
            <tr>
                <th>Quantity</th>
                <th>Vol. <span>(fl oz)</span></th>
                <th>ABV <span>(%)</span></th>
                <th>&#9249;</th>
            </tr>
        </thead>
        <tbody>
            <tr class="drink-input">
                <td><input type="number" class="qnt" value="1" min="0"></td>
                <td><input type="number" class="vol" value="12" min="1"></td>
                <td><input type="number" class="abv" value="5" min="0" max="100" stepping="0.5"></td>
                <td><button type="button" class="delete-btn">Delete</button></td>
            </tr>
        </tbody>
    </table>
    <!-- Button to add more drink inputs -->
    <button type="button" id="add-drink">Add Drink</button>
</form>

<p>Total Standard Drinks: <span id="total-standard-drinks">0</span></p>

### Reccomended limits
According to the [CDC](https://www.cdc.gov/alcohol/faqs.htm#heavyDrinking),
excessive alcohol use is defined as reaching or exceeding:
*  Men: `15` drinks per week
* Women: `8` drinks per week

<style>
th span {
    font-size: 0.75em;
}
input {
    width: 5em;
}
.qnt:before {
    content: "🍺";
}
#drink-table {
    display: inline-table;
}

#total-standard-drinks {
    font-size: 1.25em;
    font-weight: bold;
}
</style>

<script>
// Function to calculate standard drinks
function calculateStandardDrinks() {
    var totalStandardDrinks = 0;
    var drinks = document.querySelectorAll('#drink-table .drink-input');

    for (var i = 0; i < drinks.length; i++) {
        var qnt = parseFloat(drinks[i].querySelector('.qnt').value) || 0;
        var vol = parseFloat(drinks[i].querySelector('.vol').value) || 0;
        var abv = parseFloat(drinks[i].querySelector('.abv').value) || 0;

        var pureAlcohol = (vol * (abv / 100)) * qnt;
        var standardDrinks = pureAlcohol / 0.6;
        totalStandardDrinks += standardDrinks;
    }

    document.getElementById('total-standard-drinks').textContent = totalStandardDrinks.toFixed(2);
}

// Function to add another drink input row
function addDrinkInput() {
    var drinkTable = document.getElementById('drink-table').getElementsByTagName('tbody')[0];
    var newRow = drinkTable.insertRow();
    newRow.className = 'drink-input';

    newRow.innerHTML = `
        <td><input type="number" class="qnt" value="1" min="0"></td>
        <td><input type="number" class="vol" value="12" min="1"></td>
        <td><input type="number" class="abv" value="5" min="0" max="100" stepping="0.5"></td>
        <td><button type="button" class="delete-btn">Delete</button></td>
    `;

    attachInputEventListeners(newRow);
    calculateStandardDrinks();
}

// Function to attach input and delete event listeners to a row
function attachInputEventListeners(row) {
    var inputs = row.querySelectorAll('input');
    inputs.forEach(function(input) {
        input.addEventListener('input', calculateStandardDrinks);
    });

    var deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function() {
        row.remove();
        calculateStandardDrinks();
    });
}

// Event listener to prevent form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('drink-form').addEventListener('submit', function(event) {
        event.preventDefault();
    });

    // Add event listeners to all existing inputs and delete buttons
    var existingRows = document.querySelectorAll('#drink-table .drink-input');
    existingRows.forEach(attachInputEventListeners);

    // Add event listener to the "Add Another Drink" button
    document.getElementById('add-drink').addEventListener('click', addDrinkInput);
    calculateStandardDrinks();
});
</script>