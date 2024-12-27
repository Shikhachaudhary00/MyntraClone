gsap.to(".scroll img", {
    x: "-100%",   // Move the scroll container horizontally by its full width
    duration: 5,  // Duration for one full scroll (adjust as needed)
    repeat: -1,    // Repeat infinitely
    ease: "linear", 
    scrub:4 // No easing, linear movement

});

import { items } from './items.js';  // Import the items array

let bagItems = [];  // Declare the bagItems array to hold items in the bag
let bagItemsObject = [];  // Array to hold full item objects for display

// Event listener to call onLoad when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    onLoad();  // Call onLoad function after the DOM content is loaded
    displayItemHomePage();  // Display homepage items when the page loads
});

// onLoad function to load bag items and display them
function onLoad() {
    loadBagItemObjects();  // Load items from localStorage into the bag
    displayBagItems();  // Display bag items (if any)
    displayBagIcon();  // Update the bag icon with the current item count
}

// Function to load the item objects from localStorage
function loadBagItemObjects() {
    const bagItemsIds = JSON.parse(localStorage.getItem('bagItems')) || [];
    console.log('bagItemsIds:', bagItemsIds);

    // Get the full item objects based on the IDs stored in localStorage
    bagItemsObject = bagItemsIds.map(itemId => {
        return items.find(item => item.id === itemId); // Find the matching item by ID
    }).filter(item => item !== undefined); // Remove undefined entries (if no matching item)

    console.log('Loaded bagItemsObject:', bagItemsObject); // Log loaded items for debugging
}

// Function to display homepage items dynamically inside containers
function displayItemHomePage() {
    const containers = document.querySelectorAll(".items-container");  // Select containers

    if (!containers.length) {
        console.error("No containers found!");
        return;
    }

    containers.forEach((container) => {
        let innerHTML = '';  // Initialize the innerHTML variable to collect HTML content

        // Loop through the items array and generate HTML for each item
        items.forEach(item => {
            innerHTML += `
                <div class="item-container">
                    <img class="item-image" src="${item.item_image}" alt="item image">
                    <div class="rating">${item.rating.start} ⭐ ${item.rating.end}</div>
                    <div class="company">${item.company}</div>
                    <div class="item-name">${item.item_name}</div>
                    <div class="price">
                        <span class="current-price"> Rs ${item.current_price}</span>
                        <span class="original-price"> Rs ${item.original_price}</span>
                        <span class="discount">${item.discount}% OFF</span>
                    </div>
                    <div class="btn">
                        <button class="btn-add-bag" data-item-id="${item.id}">Add To Bag</button>
                        <button class="btn-add" data-item-id="${item.id}">Wishlist</button>
                    </div>
                </div>
            `;
        });

        // Insert the generated HTML into the container
        container.innerHTML = innerHTML;

        // Add event listeners to buttons
        addEventListenersToButtons();
    });
}

// Function to add event listeners to "Add to Bag" and "Add to Wishlist" buttons
function addEventListenersToButtons() {
    let addToBagButtons = document.querySelectorAll('.btn-add-bag');
    addToBagButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            addToBag(itemId);  // Add the item to the bag when clicked
        });
    });

    let wishlistButtons = document.querySelectorAll('.btn-add');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            addToWishlist(itemId);  // Add the item to the wishlist when clicked
        });
    });
}

// Function to display the bag items (if any)
function displayBagItems() {
    const containerElement = document.querySelector(".bag-items-container");
    if (!containerElement) {
        console.error('Item container not found!');
        return;
    }

    containerElement.innerHTML = '';  // Clear previous content

    if (bagItemsObject.length === 0) {
        containerElement.innerHTML = '<p>No items in your bag.</p>';
    } else {
        let innerHTML = '';
        bagItemsObject.forEach(bagItem => {
            innerHTML += generateItemHTML(bagItem);  // Add HTML for each item
        });
        containerElement.innerHTML = innerHTML;  // Insert the generated HTML into the container
    }
}

// Function to generate HTML for a single bag item
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
                    <span class="return-period-days">14 days</span> return available
                </div>
            </div>
            <div class="remove-from-cart" onclick="removeFromBag('${item.id}')">X</div>
        </div>
    `;
}

// Function to remove an item from the bag
function removeFromBag(itemId) {
    console.log('Removing item with ID:', itemId);

    // Remove the item from the bag
    bagItemsObject = bagItemsObject.filter(item => item.id !== itemId);

    // Update the localStorage
    const updatedBagItems = bagItemsObject.map(item => item.id);
    localStorage.setItem('bagItems', JSON.stringify(updatedBagItems));

    displayBagItems();  // Refresh the display
    displayBagIcon();  // Update the bag icon
}

// Function to update the bag icon with the current item count
function displayBagIcon() {
    let itemCount = document.querySelector(".bag-item-count");
    const currentBagItems = JSON.parse(localStorage.getItem('bagItems')) || [];
    if (currentBagItems.length > 0) {
        itemCount.style.visibility = "visible";
        itemCount.innerHTML = currentBagItems.length;
    } else {
        itemCount.style.visibility = "hidden";
    }
}

// Function to add an item to the bag
function addToBag(itemId) {
    const currentBagItems = JSON.parse(localStorage.getItem('bagItems')) || [];
    if (!currentBagItems.includes(itemId)) {
        currentBagItems.push(itemId);  // Add the new item ID if it's not already in the bag
        localStorage.setItem('bagItems', JSON.stringify(currentBagItems));  // Save back to localStorage
        displayBagIcon();  // Update the bag icon
    }
}

// Function to add an item to the wishlist
function addToWishlist(itemId) {
    console.log(`Added item with ID ${itemId} to the wishlist`);
}
