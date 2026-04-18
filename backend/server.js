const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  priceText: String,
  image: String
});
const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  items: Array,
  userId: String,
  total: Number,
  status: String,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// ========== SIGNUP ==========
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).send("Username already exists!");
  
  // Create user
  const user = new User({ username, password });
  await user.save();
  res.send("User created successfully!");
});

// ========== LOGIN ==========
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).send("Invalid credentials");
  
  res.send("Login success");
});

// ========== GET PRODUCTS ==========
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ========== PLACE ORDER ==========
app.post("/order", async (req, res) => {
  const { items, userId, total } = req.body;
  
  if (!userId) return res.status(400).send("Please login first!");
  if (!items || items.length === 0) return res.status(400).send("Cart is empty!");
  
  const order = new Order({ items, userId, total, status: "completed" });
  await order.save();
  res.send("Order placed successfully! ✅");
});

// ========== GET ORDERS ==========
app.get("/orders/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

// ========== ADD PRODUCTS (Only once) ==========
app.post("/add-products", async (req, res) => {
  const products = [
    { id: 1, name: "Premium Leather Bag", price: 8999, priceText: "Rs. 8,999", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=300&fit=crop" },
    { id: 2, name: "Smart Watch Pro", price: 15999, priceText: "Rs. 15,999", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
    { id: 3, name: "Wireless Headphones", price: 12999, priceText: "Rs. 12,999", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
    { id: 4, name: "Designer Sunglasses", price: 7999, priceText: "Rs. 7,999", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop" },
    { id: 5, name: "Sneakers Limited Ed", price: 12999, priceText: "Rs. 12,999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
    { id: 6, name: "Laptop Backpack", price: 5499, priceText: "Rs. 5,499", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
    { id: 7, name: "Classic Wrist Watch", price: 24999, priceText: "Rs. 24,999", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop" },
    { id: 8, name: "Leather Wallet", price: 3499, priceText: "Rs. 3,499", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop" },
    { id: 9, name: "Running Shoes", price: 9999, priceText: "Rs. 9,999", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" }
  ];
  
  await Product.deleteMany({}); // Remove old products
  await Product.insertMany(products);
  res.send("✅ Products added successfully!");
});

// ========== START SERVER ==========
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log("\n📌 Available APIs:");
  console.log("   POST   /signup     - Create account");
  console.log("   POST   /login      - Login");
  console.log("   GET    /products   - Get all products");
  console.log("   POST   /order      - Place order");
  console.log("   GET    /orders/:userId - Get orders");
  console.log("   POST   /add-products  - Add products (run once)\n");
});