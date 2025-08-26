const { initialiseDatabase } = require("./db/db.connect");
const Category = require("./models/category.model");
const Product = require("./models/product.model")
const Cart = require("./models/cart.model")
const Wishlist = require("./models/wishlist.model")
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

initialiseDatabase();

async function newCategories(category) {
  try {
    const categories = new Category(category);
    const savedCategory = await categories.save();
    return savedCategory;
  } catch (err) {
    throw err;
  }
}

app.post("/category", async (req, res) => {
  try {
    const categories = await newCategories(req.body);
    if (categories) {
      res
        .status(200)
        .json({ message: "Category added successfully", categories });
    } else {
      res.status(404).json({ error: "No categories found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to add categories" });
  }
});

async function readAllCategories() {
    try{
        const allCategories = await Category.find()
        return allCategories;
    }catch(err){
        throw(err)
    }
}

app.get("/categories",async(req,res)=>{
    try{
        const categories = await readAllCategories();
        if(categories){
            res.status(200).json(categories)
        }else{
            res.status(404).json({error:"No Categories found."})
        }
    }catch(err){
        res.status(500).json({error:"Failed to fetch categories"})
    }
})


async function readCategoryById(categoryId) {
  try{
    const categoryById = await Category.findById(categoryId);
    return categoryById;
  }catch(err){
    throw(err)
  }
}

app.get("/categories/:categoryId",async(req,res)=>{
  try{
    const categories = await readCategoryById(req.params.categoryId);
    if(categories){
      res.status(200).json(categories)
    }else{
      res.status(404).json({error:"No category found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch categories"})
  }
})


async function addProduct(product) {
  try{
    const newProduct = new Product(product);
    console.log(newProduct);
    const savedProduct = await newProduct.save();
    return savedProduct;
  }catch(err){
    // console.log(err);
    throw(err)
  }
}

app.post("/product",async(req,res)=>{
  try{
    const products = await addProduct(req.body);
    // console.log(products);
    if(products){
      res.status(200).json({message:"Product added successfully.",products})
    }else{
      res.status(404).json({error:"No product found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to add product"})
  }
})

app.get("/products",async(req,res)=>{
  try{
    const products = await Product.find();
    if(products.length!=0){
      res.json(products)
    }else{
      res.status(404).json({error:"No Product found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch products"})
  }
})

async function readProductById(productId) {
  try{
    const productById = await Product.findById({_id:productId})
    return productById;
  }catch(err){
    throw(err)
  }
}

app.get("/products/:productId",async(req,res)=>{
  try{
      const product = await readProductById(req.params.productId);
      if(product){
        res.json(product)
      }else{
        res.status(404).json({message:"Product doesn't exist."})
      }
  }catch(err){
    res.status(500).json({message:"Failed to fetch product"})
  }
})

async function readProductsByCategory(categoryId) {
    try{
      const productsByCategory = await Product.find({category:categoryId});
      return productsByCategory;
    }catch(err){
      console.log(err);
      throw(err)
    }
}

app.get("/products/category/:categoryId",async(req,res)=>{
  try{
    const products = await readProductsByCategory(req.params.categoryId)
    if(products.length!=0){
      res.json(products)
    }else{
      res.status(404).json({error:"No category found"})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch men categories"})
  }
})

async function createCartItem(newItem) {
  try{
    const cart = new Cart(newItem);
    const savedCart = await cart.save();
    return savedCart;
    }catch(err){
    console.log(err);
    throw(err)
  }
}

app.post("/cart",async(req,res)=>{
  try{
    console.log(req.body)
    const cartItems = await createCartItem(req.body)
    if(cartItems){
      res.status(201).json({
      message: "Item added to cart successfully",
      cartItem: cartItems
    });
    }else{
      res.status(404).json({error:"No items to add"})
    }
  }catch(err){
    res.status(500).json({error:"Failed to add product into cart"})
  }
})

async function readCartItems() {
  try{
    const cartItems = await Cart.find();
    return cartItems;
  }catch(err){
    console.log(err);
  }
}

app.get("/cart/items",async(req,res)=>{
  try{
    const products = await readCartItems();
    if(products.length!=0){
      res.status(200).json({message:"Cart Items:",products})
    }else{
      res.status(200).json({message:"Cart is empty"})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch cart items"})
  }
})

async function createWishlistItem(newItem) {
  try{
    const wishListItem = new Wishlist(newItem);
    const savedItem = await wishListItem.save();
    return savedItem;
  }catch(err){
    console.log(err);
    throw(err)
  }
}

app.post("/wishlistItems",async(req,res)=>{
  try{
    const items = await createWishlistItem(req.body);
    if(items){
      res.status(201).json({message:"Added Wishlist Items:",items})
    }else{
      res.status(404).json({error:"No Wishlist items"})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch wishlist items"})
  }
})

async function readAllWishListItems() {
  try{
      const items = await Wishlist.find();
      return items;
  }catch(err){
    console.log(err);
    throw(err);
  }
}

app.get("/wishlist/items/products",async(req,res)=>{
  try{
    const wishlistItems = await readAllWishListItems();
    if(wishlistItems.length!=0){
      res.json(wishlistItems);
    }else{
      res.status(404).json({error:"No items found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch wishlist items"})
  }
})

async function deleteItem(itemId){
  try{
    const deletedProduct = await Cart.findOneAndDelete({productId:itemId})
    console.log(deletedProduct)
    return deletedProduct;
  }catch(err){
    console.log(err);
    throw err;
  }
}

app.delete("/items/:itemId",async(req,res)=>{
  try{
    console.log(req.params.itemId)
    const deletedItem = await deleteItem(req.params.itemId);
    
    if(deletedItem){
      res.status(200).json({message:"Item deleted successfully",deletedItem})
    }else{
      res.status(404).json({error:"No items found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to delete the items"})
  }
})

const PORT = 3000;
app.listen(PORT, () => console.log("Server is running on", PORT));
