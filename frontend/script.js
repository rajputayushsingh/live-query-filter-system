const API_URL = "http://localhost:5000/api/products";

const searchInput = document.getElementById("searchInput");
const categoryInputs = document.querySelectorAll(".category");
const productsGrid = document.getElementById("productsGrid");
const pagination = document.getElementById("pagination");
const loading = document.getElementById("loading");

let currentPage = 1;
const limit = 6;


// Fetch Products
async function fetchProducts() {

    loading.style.display = "block";
    productsGrid.innerHTML = "";
    pagination.innerHTML = "";

    const search = searchInput.value.trim();

    const selectedCategories = Array.from(categoryInputs)
        .filter(input => input.checked)
        .map(input => input.value);

    const category = selectedCategories.join(",");

    const url =
        `${API_URL}?search=${encodeURIComponent(search)}` +
        `&category=${encodeURIComponent(category)}` +
        `&page=${currentPage}` +
        `&limit=${limit}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network response failed");
        }

        const result = await response.json();

        displayProducts(result.data);

        createPagination(
            result.page,
            result.totalPages
        );

    } catch (error) {

        console.error(error);

        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>Something went wrong</h3>
                <p>Unable to load products.</p>
            </div>
        `;

    } finally {

        loading.style.display = "none";
    }
}


// Display Products
function displayProducts(products) {

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    productsGrid.innerHTML = products.map(product => {

        return `
            <div class="card">

                <h3>${product.name}</h3>

                <p class="category">
                    Category: ${product.category}
                </p>

                <p class="price">
                    ₹${product.price}
                </p>

            </div>
        `;

    }).join("");
}


// Pagination
function createPagination(page, totalPages) {

    if (totalPages <= 1) {
        return;
    }

    const previousButton = document.createElement("button");

    previousButton.textContent = "Previous";

    previousButton.disabled = page === 1;

    previousButton.onclick = () => {

        currentPage--;

        fetchProducts();
    };


    const nextButton = document.createElement("button");

    nextButton.textContent = "Next";

    nextButton.disabled = page === totalPages;

    nextButton.onclick = () => {

        currentPage++;

        fetchProducts();
    };


    const pageInfo = document.createElement("span");

    pageInfo.textContent =
        ` Page ${page} of ${totalPages} `;

    pagination.appendChild(previousButton);

    pagination.appendChild(pageInfo);

    pagination.appendChild(nextButton);
}


// Debounce Function
function debounce(callback, delay) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);
    };
}


// Search with Debounce
const debouncedSearch = debounce(() => {

    currentPage = 1;

    fetchProducts();

}, 500);


// Search Event
searchInput.addEventListener(
    "input",
    debouncedSearch
);


// Category Filter
categoryInputs.forEach(input => {

    input.addEventListener("change", () => {

        currentPage = 1;

        fetchProducts();

    });

});


// Initial Load
fetchProducts();