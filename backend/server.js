const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const products = [
    {
        id: 1,
        name: "Nike Air Max",
        category: "Shoes",
        price: 4999
    },
    {
        id: 2,
        name: "Adidas Running Shoes",
        category: "Shoes",
        price: 3999
    },
    {
        id: 3,
        name: "Levi's Denim Jacket",
        category: "Clothing",
        price: 2999
    },
    {
        id: 4,
        name: "Puma T-Shirt",
        category: "Clothing",
        price: 1499
    },
    {
        id: 5,
        name: "Samsung Galaxy Buds",
        category: "Electronics",
        price: 5999
    },
    {
        id: 6,
        name: "Boat Wireless Headphones",
        category: "Electronics",
        price: 1999
    },
    {
        id: 7,
        name: "Casio Watch",
        category: "Accessories",
        price: 2499
    },
    {
        id: 8,
        name: "Fossil Wallet",
        category: "Accessories",
        price: 3499
    },
    {
        id: 9,
        name: "Puma Sneakers",
        category: "Shoes",
        price: 2999
    },
    {
        id: 10,
        name: "H&M Hoodie",
        category: "Clothing",
        price: 1999
    },
    {
        id: 11,
        name: "Sony Headphones",
        category: "Electronics",
        price: 7999
    },
    {
        id: 12,
        name: "Titan Watch",
        category: "Accessories",
        price: 4999
    }
];

app.get("/api/products", (req, res) => {

    const search = req.query.search || "";
    const category = req.query.category || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    let filteredProducts = products;

    // Search filter
    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Category filter
    if (category) {
        const categories = category.split(",");

        filteredProducts = filteredProducts.filter(product =>
            categories.includes(product.category)
        );
    }

    const total = filteredProducts.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(
        startIndex,
        endIndex
    );

    res.json({
        success: true,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        data: paginatedProducts
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});