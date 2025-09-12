const { initialiseDatabase } = require("./db/db.connect");
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Cart = require("./models/cart.model");
const Wishlist = require("./models/wishlist.model");
const User = require("./models/user.model");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Order = require("./models/orders.model");
const Address = require("./models/address.model");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

initialiseDatabase();

// Function to create new categories
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

// Function to get all the categories from the db
async function readAllCategories() {
  try {
    const allCategories = await Category.find();
    return allCategories;
  } catch (err) {
    throw err;
  }
}

app.get("/categories", async (req, res) => {
  try {
    const categories = await readAllCategories();
    if (categories) {
      res.status(200).json(categories);
    } else {
      res.status(404).json({ error: "No Categories found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Function to read the category by its id.

async function readCategoryById(categoryId) {
  try {
    const categoryById = await Category.findById(categoryId);
    return categoryById;
  } catch (err) {
    throw err;
  }
}

app.get("/categories/:categoryId", async (req, res) => {
  try {
    const categories = await readCategoryById(req.params.categoryId);
    if (categories) {
      res.status(200).json(categories);
    } else {
      res.status(404).json({ error: "No category found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Function to add a product 
async function addProduct(product) {
  try {
    const newProduct = new Product(product);
    // console.log(newProduct);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (err) {
    // console.log(err);
    throw err;
  }
}

app.post("/product", async (req, res) => {
  try {
    const products = await addProduct(req.body);
    // console.log(products);
    if (products) {
      res
        .status(200)
        .json({ message: "Product added successfully.", products });
    } else {
      res.status(404).json({ error: "No product found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// TO get all the products from the db.

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No Product found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Function to get a product by its ID.

async function readProductById(productId) {
  try {
    const productById = await Product.findById({ _id: productId });
    return productById;
  } catch (err) {
    throw err;
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await readProductById(req.params.productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product doesn't exist." });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Function to get products by their cateogory with help of id. 

async function readProductsByCategory(categoryId) {
  try {
    const productsByCategory = await Product.find({ category: categoryId });
    return productsByCategory;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/products/category/:categoryId", async (req, res) => {
  try {
    const products = await readProductsByCategory(req.params.categoryId);
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No category found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch men categories" });
  }
});

// Function to create a cart item.

async function createCartItem(newItem) {
  try {
    const existingItem = await Cart.findOne({
      userID: newItem.userID,
      productId: newItem.productId,
      size: newItem.size,
    });
    // console.log(existingItem);

    if (existingItem) {
      return await Cart.findOneAndUpdate(
        { userID: newItem.userID },
        { productId: newItem.productId },
        { $inc: { quantity: 1 } }
      );
    }
    const cart = new Cart(newItem);
    const savedCart = await cart.save();
    return savedCart;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.post("/cart", async (req, res) => {
  try {
    // console.log(req.body);
    const cartItems = await createCartItem(req.body);
    if (cartItems) {
      res.status(201).json({
        message: "Item added to cart successfully",
        cartItem: cartItems,
      });
    } else {
      res.status(404).json({ error: "No items to add" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to add product into cart" });
  }
});

// Function to get all the products from CART.

async function readCartItems() {
  try {
    const cartItems = await Cart.find();
    return cartItems;
  } catch (err) {
    console.log(err);
  }
}

app.get("/cart/items", async (req, res) => {
  try {
    const products = await readCartItems();
    if (products.length != 0) {
      res.status(200).json(products);
    } else {
      res.status(200).json({ message: "Cart is empty" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Function to read product from cart by its ID.
async function readCartItemsById(productId) {
  try {
    const cartItemsById = await Cart.findById(productId);
    return cartItemsById;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/cart/items/:itemId", async (req, res) => {
  try {
    const product = await readCartItemsById(req.params.itemId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "No product found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Function to update quantity of an item in the cart.

async function updateCartItemQuantity(itemId, newQuantity) {
  // console.log(itemId, newQuantity);
  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { _id: itemId },
      { quantity: newQuantity },
      { new: true }
    );
    return updatedItem;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.put("/cart/items/:itemId", async (req, res) => {
  try {
    const updatedItem = await updateCartItemQuantity(
      req.params.itemId,
      req.body.quantity
    );
    console.log(updatedItem);
    if (updatedItem) {
      res.status(200).json({
        message: "Cart item quantity updated successfully",
        updatedItem,
      });
    } else {
      res.status(404).json({ error: "Cart item not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item quantity" });
  }
});

// Function to get all the cart items of a particular user by their ID.

async function readCartItemsByUser(userId) {
  try{
    const cartItems = await Cart.find({userID:userId});
    return cartItems;
  }catch(err){
    console.log(err);
    throw(err);
  }
}

app.get("/cart/:userId",async(req,res)=>{
  try{
    const cart = await readCartItemsByUser(req.params.userId);
    if(cart.length!=0){
      res.status(200).json(cart);
    }else{
      res.status(404).json({error:"This user cart is empty"})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch cart items."})
  }
})

// Function to create a new wishlist item.

async function createWishlistItem(newItem) {
  console.log(newItem);
  
  try {
    const wishListItem = new Wishlist(newItem);
    const savedItem = await wishListItem.save();
    return savedItem;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.post("/wishlistItems", async (req, res) => {
  try {
    const items = await createWishlistItem(req.body);
    if (items) {
      res.status(201).json(items);
    } else {
      res.status(404).json({ error: "No Wishlist items" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist items" });
  }
});

// Function to get all the wishlist items.

async function readAllWishListItems() {
  try {
    const items = await Wishlist.find();
    return items;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/wishlist/items/products", async (req, res) => {
  try {
    const wishlistItems = await readAllWishListItems();
    if (wishlistItems.length != 0) {
      res.json(wishlistItems);
    } else {
      res.status(404).json({ error: "No items found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wishlist items" });
  }
});

// Function to get all the wishlist items of a user by their ID.

async function readWishlistItemsByUser(userId) {
  try{
    const wishlist = await Wishlist.find({userID:userId})
    return wishlist;
  }catch(err){
  console.log(err);
  throw(err)
  }
}

app.get("/wishlist/:userId",async(req,res)=>{
  try{
    const wishlist = await readWishlistItemsByUser(req.params.userId);
    if(wishlist.length!=0){
      res.status(200).json(wishlist)
    }else{
      res.status(404).json({error:"No items found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to fetch wishlist items"})
  }
})

// Function to clear wishlist for each user by their id.

async function clearWishlistItems(userId) {
  try{
    const wishlist = await Wishlist.deleteMany({userID:userId});
    return wishlist
  }catch(err){
    console.log(err);
    throw(err);
  }
}

app.delete("/wishlist/clear/:userId",async(req,res)=>{
  try{
    const wishlist = await clearWishlistItems(req.params.userId);
    if(wishlist){
      res.status(200).json(wishlist)
    }else{
      res.status(404).json({error:"No items found."})
    }
  }catch(err){
    res.status(500).json({error:"Failed to clear cart"})
  }
})

// Function to clear cart for each user by their id.
async function clearCartItems(userId) {
  try {
    const cart = await Cart.deleteMany({ userID: userId });
    return cart;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.delete("/cart/clear/:userId", async (req, res) => {
  try {
    const cart = await clearCartItems(req.params.userId);
    if (cart) {
      res.status(200).json({ message: "Cart deleted successfully" });
    } else {
      res.status(404).json({ error: "No items found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
});

// Function to delete an item from cart by its id.

async function deleteItem(itemId) {
  try {
    const deletedProduct = await Cart.findByIdAndDelete(itemId);
    // console.log(deletedProduct)
    return deletedProduct;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.delete("/items/:itemId", async (req, res) => {
  try {
    console.log(req.params.itemId);
    const deletedItem = await deleteItem(req.params.itemId);

    if (deletedItem) {
      res
        .status(200)
        .json({ message: "Item deleted successfully", deletedItem });
    } else {
      res.status(404).json({ error: "No items found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the items" });
  }
});

// Function to delete an item from wishlist by its id.

async function deleteItemFromWishList(productId) {
  try {
    const product = await Wishlist.findByIdAndDelete(productId);
    return product;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.delete("/wishlist/items/:itemId", async (req, res) => {
  try {
    const products = await deleteItemFromWishList(req.params.itemId);
    if (products) {
      res.status(200).json({ message: "Deleted Item:", products });
    } else {
      res.status(404).json({ error: "No Products found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete products" });
  }
});

// Function to create a new user 

async function createUser(user) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const userData = {
      ...user,
      password: hashedPassword,
    };
    const newUser = new User(userData);
    // console.log(newUser);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Creating a new user & a new address

app.post("/user", async (req, res) => {
  try {
    const existingUser = await readUsersByEmail(req.body.emailID);

    if (existingUser) {
      res
        .status(409)
        .json({ error: "User already exist please login to continue" });
    }
    const users = await createUser(req.body);

    if (users) {
      const addressData = {
        userID: users._id,
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        country: req.body.address.country,
        pincode: req.body.address.pincode,
      };

      const address = await addAddress(addressData);

      res.status(201).json({
        message: "User and address created successfully",
        user: users,
        address: address,
      });
    } else {
      res.status(404).json({ error: "Failed to create user" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Function to get all the users 

async function readAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/users", async (req, res) => {
  try {
    const users = await readAllUsers();
    if (users.length != 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "No user found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Function to get users by their emails.

async function readUsersByEmail(email) {
  try {
    const usersByEmail = await User.findOne({ emailID: email });
    return usersByEmail;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password are required" });
  }
  try {
    const user = await readUsersByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isValidPassword = bcrypt.compare(user.password, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    return res.status(200).json({ message: "Login Success", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Function to create a new order.

async function createOrder(newOrder, userID) {
  try {
    const orderData = {
      ...newOrder,
      userID: userID,
    };
    const order = new Order(orderData);
    const savedOrder = await order.save();

    return savedOrder;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Function to get all the orders 

async function readAllOrders() {
  try {
    const allOrders = await Order.find();
    return allOrders;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/orders", async (req, res) => {
  try {
    const orders = await readAllOrders();
    if (orders.length != 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ error: "No Orders found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Function to get all the orders placed by a particular user by their ID.

async function readOrdersByUserID(userID) {
  try {
    const ordersByUser = await Order.find({ userID: userID });
    return ordersByUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await readOrdersByUserID(req.params.userId);
    if (orders.length !== 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ error: "No Orders found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders by User ID" });
  }
});

// Route for creating an order.

app.post("/checkout", async (req, res) => {
  try {
    const { userID, items, totalAmount, paymentMethod, address } = req.body;

    if (!userID || !items || !totalAmount || !paymentMethod || !address) {
      res.status(404).json({ error: "Missing required fields" });
      return;
    }
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.country
    ) {
      return res.status(400).json({ error: "Incomplete address information" });
    }
    const orderData = {
      userID,
      items,
      totalAmount,
      paymentMethod,
      address: [
        {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
        },
      ],
    };

    const newOrder = await createOrder(orderData, userID);

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Failed to process checkout" });
  }
});

// Function to add a new address

async function addAddress(newAddress) {
  try {
    const address = new Address(newAddress);
    const savedAddress = await address.save();
    return savedAddress;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.post("/address", async (req, res) => {
  try {
    const address = await addAddress(req.body);
    if (address) {
      res.status(201).json(address);
    } else {
      res.status(404).json({ error: "No address found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to create a new address" });
  }
});

// function to get all the addresses that are available in db.

async function readAllAddress() {
  try {
    const allAddresses = await Address.find();
    return allAddresses;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/addresses", async (req, res) => {
  try {
    const addresses = await readAllAddress();
    if (addresses.length != 0) {
      res.status(200).json(addresses);
    } else {
      res.status(404).json({ error: "No address exist." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Function to get the address for each user by their ID's

async function readAddressByUserID(id) {
  try {
    const addressByUserId = await Address.find({ userID: id });
    return addressByUserId;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.get("/address/:userId", async (req, res) => {
  try {
    const address = await readAddressByUserID(req.params.userId);
    if (address.length != 0) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ error: "No address found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// Function to delete address by its ID.
async function deleteAddressById(id) {
  try {
    const address = await Address.findByIdAndDelete(id);
    return address;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.delete("/user/address/:id", async (req, res) => {
  try {
    const address = await deleteAddressById(req.params.id);
    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ error: "No address found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the address" });
  }
});

// Function to update an address by id.

async function updateAddress(id, updateData) {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      { _id: id },
      updateData
    );
    return updatedAddress;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.put("/user/addresses/address/:id", async (req, res) => {
  try {
    const address = await updateAddress(req.params.id, req.body);
    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ error: "Failed to update the address" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the address." });
  }
});



const PORT = 3000;
app.listen(PORT, () => console.log("Server is running on", PORT));
