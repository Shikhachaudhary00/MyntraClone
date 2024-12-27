import { items } from './items.js';  // Import the items array

let bagItemsObject = [];  // Array to hold item objects in the bag

document.addEventListener('DOMContentLoaded', function () {
    loadBagItemObjects();  // Load items from localStorage and display them
    displayBagItems();  // Display items in the bag when DOM is ready
});

// Load the item objects from localStorage
function loadBagItemObjects() {
    const bagItemsIds = JSON.parse(localStorage.getItem('bagItems')) || [];
    console.log('bagItemsIds:', bagItemsIds);

    // Get the full item objects based on the IDs stored in localStorage
    bagItemsObject = bagItemsIds.map(itemId => {
        return items.find(item => item.id === itemId); // Find the matching item by ID
    }).filter(item => item !== undefined); // Remove undefined entries (if no matching item)

    console.log('Loaded bagItemsObject:', bagItemsObject); // Log loaded items for debugging
}

// Declare the removeFromBag function in the global scope (attach it to window)
window.removeFromBag = function(itemId) {
    console.log('Removing item with ID:', itemId);

    // Remove the item from the bag
    bagItemsObject = bagItemsObject.filter(item => item.id !== itemId);

    // Update the localStorage
    const updatedBagItems = bagItemsObject.map(item => item.id);
    localStorage.setItem('bagItems', JSON.stringify(updatedBagItems));

    // After removing the item, update the displayed bag items
    displayBagItems();
}

// Function to generate the HTML for a single bag item
function generateItemHTML(item) {
    return `
        <div class="bag-item-container">
            <div class="item-left-part">
                <img class="bag-item-img" src="${item.item_image}" alt="${item.item_name}">
            </div>
            <div class="item-right-part">
                <div class="company">${item.company}</div>
                <div class="item-name">${item.item_name}</div>
                <div class="price-container">
                    <span class="current-price">₹${item.current_price}</span>
                    <span class="original-price">₹${item.original_price}</span>
                    <span class="discount-percentage">(${item.discount}% OFF)</span>
                </div>
                <div class="return-period">
                    <span class="return-period-days">${item.return_period}</span> return available
                </div>
                <div class="delivery-details">
                    Delivery by <span class="delivery-details-days">${item.delivery_date}</span>
                </div>
            </div>
            <div class="remove-from-cart" data-item-id="${item.id}">X</div>
        </div>
    `;
}

// Function to update the price details in the bag summary
function updateBagSummary() {
    if (bagItemsObject.length === 0) {
        // Hide price details if no items in the bag
        document.querySelector(".bag-summary").style.display = 'none';
        return;
    }

    let totalMRP = 0;
    let totalDiscount = 0;
    let convenienceFee = 99;  // Example convenience fee, you can change as per your requirement

    // Calculate total MRP and discount for all items in the bag
    bagItemsObject.forEach(item => {
        totalMRP += item.original_price;
        totalDiscount += item.original_price - item.current_price; // Discount is the difference
    });

    // Calculate total amount
    const totalAmount = totalMRP - totalDiscount + convenienceFee;

    // Update the bag summary section
    const priceDetailsContainer = document.querySelector(".bag-summary");
    if (priceDetailsContainer) {
        priceDetailsContainer.style.display = 'block';  // Ensure the price summary is shown
        priceDetailsContainer.innerHTML = `
            <div class="bag-details-container">
                <div class="price-header">PRICE DETAILS (${bagItemsObject.length} Items)</div>
                <div class="price-item">
                    <span class="price-item-tag">Total MRP</span>
                    <span class="price-item-value">₹${totalMRP}</span>
                </div>
                <div class="price-item">
                    <span class="price-item-tag">Discount on MRP</span>
                    <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
                </div>
                <div class="price-item">
                    <span class="price-item-tag">Convenience Fee</span>
                    <span class="price-item-value">₹${convenienceFee}</span>
                </div>
                <hr>
                <div class="price-footer">
                    <span class="price-item-tag">Total Amount</span>
                    <span class="price-item-value">₹${totalAmount}</span>
                </div>
            </div>
            <button class="btn-place-order">
                <div class="css-xjhrni">PLACE ORDER</div>
            </button>
        `;
    }
}

// Function to display the items in the bag and update the price summary
function displayBagItems() {
    let containerElement = document.querySelector(".bag-items-container");

    if (!containerElement) {
        console.error('Item container not found!');
        return; // Exit if the container doesn't exist
    }

    containerElement.innerHTML = '';  // Clear previous content

    if (bagItemsObject.length === 0) {
        containerElement.innerHTML = '<p>No items in your bag.</p>';
    } else {
        let innerHTML = '';
        bagItemsObject.forEach(bagItem => {
            innerHTML += generateItemHTML(bagItem); // Add HTML for each item
        });
        containerElement.innerHTML = innerHTML;  // Insert the generated HTML into the container
    }

    // Update the bag summary (it will hide if no items)
    updateBagSummary();

    // Add event listeners to remove buttons
    addRemoveItemEventListeners();
}

// Function to add event listeners for the 'Remove from Cart' functionality
function addRemoveItemEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            removeFromBag(itemId);  // Call the removeFromBag function when clicked
        });
    });
}
