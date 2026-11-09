
"use strict";

// =====================================================
// SMARTMART E-COMMERCE WEBSITE
// Main JavaScript Application
// =====================================================


// =====================================================
// 1. PRODUCT DATA
// =====================================================

const products = [
    {
        id: "wireless-headphones",
        name: "Wireless Headphones",
        category: "electronics",
        price: 8500,
        stock: 15,
        image: "assets/images/product-headphones.png",
        description: "High-quality wireless headphones."
    },
    {
        id: "laptop",
        name: "Laptop",
        category: "electronics",
        price: 85000,
        stock: 8,
        image: "assets/images/product-laptop.png",
        description: "Powerful laptop for everyday work."
    },
    {
        id: "smart-watch",
        name: "Smart Watch",
        category: "electronics",
        price: 15000,
        stock: 10,
        image: "assets/images/product-smartwatch.png",
        description: "Modern smartwatch with useful features."
    },
    {
        id: "blender",
        name: "Blender",
        category: "home-kitchen",
        price: 8500,
        stock: 12,
        image: "assets/images/product-blender.png",
        description: "Convenient kitchen blender."
    },
    {
        id: "air-fryer",
        name: "Air Fryer",
        category: "home-kitchen",
        price: 18000,
        stock: 7,
        image: "assets/images/product-air-fryer.png",
        description: "Modern air fryer for healthier cooking."
    },
    {
        id: "rice-cooker",
        name: "Rice Cooker",
        category: "home-kitchen",
        price: 12000,
        stock: 10,
        image: "assets/images/product-rice.png",
        description: "Easy-to-use electric rice cooker."
    },
    {
        id: "shirt",
        name: "Casual Shirt",
        category: "clothing",
        price: 3500,
        stock: 20,
        image: "assets/images/product-shirt.png",
        description: "Comfortable casual shirt."
    },
    {
        id: "shoes",
        name: "Sports Shoes",
        category: "clothing",
        price: 7500,
        stock: 14,
        image: "assets/images/product-shoes.png",
        description: "Comfortable sports shoes."
    }
];


// =====================================================
// 2. APPLICATION STORAGE
// =====================================================

// Load cart from localStorage.
// If no cart exists, create an empty array.

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("smartmartCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }
} catch (error) {
    console.error("Unable to load saved cart:", error);
    cart = [];
}


// =====================================================
// 3. HTML ELEMENT REFERENCES
// =====================================================

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");

const applyFilters = document.getElementById("applyFilters");
const sortProducts = document.getElementById("sortProducts");

const productContainer = document.getElementById("productList");


// =====================================================
// 4. CURRENCY FORMATTER
// =====================================================

function formatPrice(price) {

    return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);

}


// =====================================================
// 5. DISPLAY PRODUCTS
// =====================================================

function displayProducts(productList) {

    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    // Check whether products are available

    if (productList.length === 0) {

        productContainer.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;

        return;
    }

    // Display each product

    for (let i = 0; i < productList.length; i++) {

        const product = productList[i];

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <h3>${product.name}</h3>

            <p class="product-price">
                ${formatPrice(product.price)}
            </p>

            <p class="product-stock">
                ${
                    product.stock > 0
                    ? `Stock: ${product.stock}`
                    : "Out of Stock"
                }
            </p>

            <a href="product-details.html?id=${encodeURIComponent(product.id)}">
                View Details
            </a>

            <button
                type="button"
                class="add-to-cart"
                data-product-id="${product.id}"
                ${product.stock === 0 ? "disabled" : ""}
            >
                Add to Cart
            </button>
        `;

        productContainer.appendChild(productCard);
    }

}


// =====================================================
// 6. SEARCH PRODUCTS
// =====================================================

function searchProducts() {

    if (!searchInput) {
        return products;
    }

    const searchName = searchInput.value
        .trim()
        .toLowerCase();

    let searchResults = [];

    // Empty search returns all products

    if (searchName === "") {
        return products;
    }

    // Search by product name and description

    for (let i = 0; i < products.length; i++) {

        const productName = products[i].name.toLowerCase();

        const productDescription =
            products[i].description.toLowerCase();

        if (
            productName.includes(searchName) ||
            productDescription.includes(searchName)
        ) {

            searchResults.push(products[i]);

        }
    }

    return searchResults;

}


// =====================================================
// 7. FILTER PRODUCTS
// =====================================================

function filterProducts(productList) {

    let filteredResults = [];

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "";

    const minimum = minPrice && minPrice.value !== ""
        ? Number(minPrice.value)
        : 0;

    const maximum = maxPrice && maxPrice.value !== ""
        ? Number(maxPrice.value)
        : Infinity;

    // Validate price range

    if (
        minimum < 0 ||
        maximum < 0 ||
        minimum > maximum
    ) {

        return filteredResults;

    }

    for (let i = 0; i < productList.length; i++) {

        const product = productList[i];

        const categoryMatches =
            selectedCategory === "" ||
            product.category === selectedCategory;

        const minimumMatches =
            product.price >= minimum;

        const maximumMatches =
            product.price <= maximum;

        if (
            categoryMatches &&
            minimumMatches &&
            maximumMatches
        ) {

            filteredResults.push(product);

        }
    }

    return filteredResults;

}


// =====================================================
// 8. SORT PRODUCTS
// =====================================================

function sortProductList(productList) {

    // Create a copy to avoid changing original product data

    let sortedResults = [...productList];

    const sortValue = sortProducts
        ? sortProducts.value
        : "featured";

    if (sortValue === "price-low") {

        sortedResults.sort(function (a, b) {
            return a.price - b.price;
        });

    }

    else if (sortValue === "price-high") {

        sortedResults.sort(function (a, b) {
            return b.price - a.price;
        });

    }

    else if (sortValue === "name") {

        sortedResults.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    }

    return sortedResults;

}


// =====================================================
// 9. UPDATE PRODUCT CATALOGUE
// =====================================================

function updateProducts() {

    let results = searchProducts();

    results = filterProducts(results);

    results = sortProductList(results);

    displayProducts(results);

}


// =====================================================
// 10. SAVE CART
// =====================================================

function saveCart() {

    try {

        localStorage.setItem(
            "smartmartCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error("Unable to save cart:", error);

        alert("Unable to save your cart. Check browser storage.");

    }

}


// =====================================================
// 11. FIND PRODUCT BY ID
// =====================================================

function findProductById(productId) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id === productId) {

            return products[i];

        }
    }

    return null;

}


// =====================================================
// 12. ADD PRODUCT TO CART
// =====================================================

function addToCart(productId) {

    const selectedProduct = findProductById(productId);

    // Check whether product exists

    if (selectedProduct === null) {

        alert("Product not found.");

        return;

    }

    // Find existing cart item

    let existingCartItem = null;

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].productId === productId) {

            existingCartItem = cart[i];

            break;

        }
    }

    // Determine current quantity

    const currentQuantity = existingCartItem
        ? existingCartItem.quantity
        : 0;

    // Check stock availability

    if (currentQuantity >= selectedProduct.stock) {

        alert("Sorry! Maximum available stock reached.");

        return;

    }

    // Increase existing quantity

    if (existingCartItem !== null) {

        existingCartItem.quantity++;

    }

    // Create new cart item

    else {

        const cartItem = {

            productId: selectedProduct.id,

            name: selectedProduct.name,

            price: selectedProduct.price,

            quantity: 1

        };

        cart.push(cartItem);

    }

    saveCart();

    updateCartCount();

    alert(selectedProduct.name + " added to cart!");

}


// =====================================================
// 13. UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    let totalItems = 0;

    for (let i = 0; i < cart.length; i++) {

        totalItems += cart[i].quantity;

    }

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = totalItems;

    }

}


// =====================================================
// 14. REMOVE PRODUCT FROM CART
// =====================================================

function removeFromCart(productId) {

    let updatedCart = [];

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].productId !== productId) {

            updatedCart.push(cart[i]);

        }
    }

    cart = updatedCart;

    saveCart();

    updateCartCount();

}


// =====================================================
// 15. CHANGE CART QUANTITY
// =====================================================

function updateCartQuantity(productId, newQuantity) {

    const selectedProduct = findProductById(productId);

    if (selectedProduct === null) {
        return;
    }

    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity)) {
        return;
    }

    if (quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    if (quantity > selectedProduct.stock) {

        alert("Requested quantity exceeds available stock.");

        return;

    }

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].productId === productId) {

            cart[i].quantity = quantity;

            break;

        }
    }

    saveCart();

    updateCartCount();

}


// =====================================================
// 16. CALCULATE CART SUBTOTAL
// =====================================================

function calculateCartSubtotal() {

    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {

        subtotal += cart[i].price * cart[i].quantity;

    }

    return subtotal;

}


// =====================================================
// 17. PRODUCT BUTTON EVENT LISTENER
// =====================================================

// Event delegation allows dynamically created buttons
// to work without attaching separate listeners.

if (productContainer) {

    productContainer.addEventListener("click", function (event) {

        const button = event.target.closest(".add-to-cart");

        if (!button || !productContainer.contains(button)) {
            return;
        }

        const productId = button.dataset.productId;

        addToCart(productId);

    });

}


// =====================================================
// 18. SEARCH FORM EVENT
// =====================================================

if (searchForm) {

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        updateProducts();

    });

}


// =====================================================
// 19. SEARCH AS USER TYPES
// =====================================================

if (searchInput) {

    searchInput.addEventListener("input", function () {

        updateProducts();

    });

}


// =====================================================
// 20. FILTER BUTTON EVENT
// =====================================================

if (applyFilters) {

    applyFilters.addEventListener("click", function () {

        updateProducts();

    });

}


// =====================================================
// 21. SORT EVENT
// =====================================================

if (sortProducts) {

    sortProducts.addEventListener("change", function () {

        updateProducts();

    });

}


// =====================================================
// 22. INITIALIZE APPLICATION
// =====================================================

updateProducts();

updateCartCount();


// =====================================================
// END OF SMARTMART APPLICATION
// =====================================================

// =====================================================
// 23. SMARTMART CART PAGE
// =====================================================

// Cart page HTML elements

const cartItemsContainer = document.getElementById("cartItems");

const cartSubtotalElement = document.getElementById("cartSubtotal");
const discountAmountElement = document.getElementById("discountAmount");
const vatAmountElement = document.getElementById("vatAmount");
const deliveryAmountElement = document.getElementById("deliveryAmount");
const cartTotalElement = document.getElementById("cartTotal");

const discountCodeInput = document.getElementById("discountCode");
const applyDiscountButton = document.getElementById("applyDiscount");

// Delivery charge

const DELIVERY_CHARGE = 350;

// Demo discount codes

const discountCodes = {
    "SMART10": {
        type: "percentage",
        value: 10
    },
    "SAVE500": {
        type: "fixed",
        value: 500
    }
};

let appliedDiscount = null;


// =====================================================
// 24. DISPLAY CART ITEMS
// =====================================================

function displayCart() {

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    // Check empty cart

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="products.html">Continue Shopping</a>
        `;

        updateCartSummary();

        return;
    }

    // Display each cart item

    for (let i = 0; i < cart.length; i++) {

        const item = cart[i];

        const product = findProductById(item.productId);

        if (!product) {
            continue;
        }

        const cartItemElement = document.createElement("div");

        cartItemElement.className = "cart-item";

        cartItemElement.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                width="100"
            >

            <div class="cart-item-details">

                <h3>${product.name}</h3>

                <p>Price: ${formatPrice(item.price)}</p>

                <p>
                    Item Total:
                    ${formatPrice(item.price * item.quantity)}
                </p>

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="quantity-decrease"
                        data-product-id="${item.productId}"
                    >
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-increase"
                        data-product-id="${item.productId}"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    data-product-id="${item.productId}"
                >
                    Remove
                </button>

            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);

    }

    updateCartSummary();

}


// =====================================================
// 25. CALCULATE DISCOUNT
// =====================================================

function calculateDiscount(subtotal) {

    if (appliedDiscount === null) {
        return 0;
    }

    let discount = 0;

    if (appliedDiscount.type === "percentage") {

        discount = subtotal * appliedDiscount.value / 100;

    }

    else if (appliedDiscount.type === "fixed") {

        discount = appliedDiscount.value;

    }

    // Discount cannot exceed subtotal

    return Math.min(discount, subtotal);

}


// =====================================================
// 26. UPDATE CART SUMMARY
// =====================================================

function updateCartSummary() {

    if (!cartSubtotalElement) {
        return;
    }

    const subtotal = calculateCartSubtotal();

    const discount = calculateDiscount(subtotal);

    const taxableAmount = subtotal - discount;

    const vat = taxableAmount * 0.18;

    const delivery = cart.length > 0
        ? DELIVERY_CHARGE
        : 0;

    const total = taxableAmount + vat + delivery;

    // Display calculations

    cartSubtotalElement.textContent = formatPrice(subtotal);

    discountAmountElement.textContent = formatPrice(discount);

    vatAmountElement.textContent = formatPrice(vat);

    deliveryAmountElement.textContent = formatPrice(delivery);

    cartTotalElement.textContent = formatPrice(total);

}


// =====================================================
// 27. APPLY DISCOUNT CODE
// =====================================================

if (applyDiscountButton) {

    applyDiscountButton.addEventListener("click", function () {

        const enteredCode = discountCodeInput.value
            .trim()
            .toUpperCase();

        if (enteredCode === "") {

            alert("Please enter a discount code.");

            return;

        }

        if (discountCodes[enteredCode]) {

            appliedDiscount = discountCodes[enteredCode];

            alert("Discount applied successfully!");

        }

        else {

            appliedDiscount = null;

            alert("Invalid discount code.");

        }

        updateCartSummary();

    });

}


// =====================================================
// 28. CART QUANTITY AND REMOVE BUTTONS
// =====================================================

if (cartItemsContainer) {

    cartItemsContainer.addEventListener("click", function (event) {

        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const productId = button.dataset.productId;

        if (!productId) {
            return;
        }

        // Increase quantity

        if (button.classList.contains("quantity-increase")) {

            let currentQuantity = 0;

            for (let i = 0; i < cart.length; i++) {

                if (cart[i].productId === productId) {

                    currentQuantity = cart[i].quantity;

                    break;
                }
            }

            updateCartQuantity(
                productId,
                currentQuantity + 1
            );

            displayCart();

        }

        // Decrease quantity

        else if (button.classList.contains("quantity-decrease")) {

            let currentQuantity = 0;

            for (let i = 0; i < cart.length; i++) {

                if (cart[i].productId === productId) {

                    currentQuantity = cart[i].quantity;

                    break;
                }
            }

            updateCartQuantity(
                productId,
                currentQuantity - 1
            );

            displayCart();

        }

        // Remove item

        else if (button.classList.contains("remove-cart-item")) {

            removeFromCart(productId);

            displayCart();

        }

    });

}


// =====================================================
// 29. INITIALIZE CART PAGE
// =====================================================

displayCart();

updateCartCount();


// =====================================================
// END OF CART PAGE FUNCTIONALITY
// =====================================================
