require("dotenv").config();
require("./model/db");
const nodemailer = require("nodemailer");
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET;

const { storage } = require("./storage/storage");
const { resstorage } = require("./storage/resstorage");
const { dishStorage } = require("./storage/dishStorage");
const { cloudinary } = require("./storage/temp");

const ImageModel = require("./model/schema");
const ResImageModel = require("./model/reschema");
const DishImageModel = require("./model/dishSchema");
const OTP = require("./model/otpSchema");
const UserModel = require("./model/userSchema");
const AgentModel = require("./model/agentSchema");
const OrderModel = require("./model/orderSchema");

const multer = require("multer");
const upload = multer({ storage });

// Middleware to parse JSON requests
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// upload food item image
app.post("/addData", upload.single("image"), async (req, res) => {
  res.send(req.file);

  //  for a food item image store
  const { name, price, category } = JSON.parse(req.body.formData);
  const temp = await ImageModel.create({
    name,
    price,
    category,
    imageURL: req.file.path,
    imgId: req.file.filename,
  });
});

// upload restaurant image
app.post("/addResData", resstorage.single("image"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file); // Debugging step

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, location, star, status } = JSON.parse(req.body.formData);
    const restaurant = await ResImageModel.create({
      name,
      location,
      star,
      status,
      imageURL: req.file.path,
      imgId: req.file.filename,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
});

// add a dish image with some details of other items
app.post("/addDishData", dishStorage.single("image"), async (req, res) => {
  try {
    // console.log("Uploaded File:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { id, name, category, description, price, status } = JSON.parse(
      req.body.formData
    );
    const Dishes = await DishImageModel.create({
      id,
      name,
      category,
      description,
      price,
      status,
      imageURL: req.file.path,
      imgId: req.file.filename,
    });

    res.status(201).json(Dishes);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
});

// add a userData  || signUp
app.post("/addUser", async (req, res) => {
  try {
    const { userName, mailId, password } = req.body;

    // check user is already exist
    const existingUser = await UserModel.findOne({ mailId });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const userData = await UserModel.create({
      userName,
      mailId,
      password,
    });

    // create jwt token
    const token = jwt.sign({ id: userData._id, mailId }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true while production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // res.status(201).json(userData);
    res.status(201).json({
      token,
      user: {
        _id: userData._id,
        userName: userData.userName,
        mailId: userData.mailId,
      },
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error.response ? error.response.data : error.message
    );
  }
});

// user login data
app.post("/addLoginUser", async (req, res) => {
  try {
    const { mailId, password } = req.body;

    // check if user exists
    const user = await UserModel.findOne({ mailId });
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("user", user);

    //compared entered password (plain text) with stored hashed password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    console.log("ismatch ", isMatch);

    // create jwt token
    const token = jwt.sign({ id: user._id, mailId: user.mailId }, SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("Generated Token", token);

    // store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true while production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // res.status(200).json({ message: "Login successful", user });
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        mailId: user.mailId,
      },
    });
  } catch (err) {
    console.error("user login data not store:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/verifyEmail", async (req, res) => {
  try {
    const { mailId } = req.body;

    // Basic validation
    if (!mailId) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ mailId });

    if (user) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: "Email verified successfully",
      });
    } else {
      return res.status(404).json({
        success: true,
        exists: false,
        message: "Email not found in our system",
      });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying email",
    });
  }
});

// ------------------ otp -------------------------- //

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaymanavadariya64@gmail.com",
    pass: "sukn ccbi dqbv mazt",
  },
});

// Generate OTP & Store in DB
app.post("/sendOTP", async (req, res) => {
  const { email } = req.body;
  console.log("email", email);

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log("OOOOOOTp:", otp);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiration

  await OTP.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });

  await transporter.sendMail({
    from: "jaymanavadariya64@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  });

  res.json({ success: true, message: "OTP sent!" });
});

// Verify OTP
app.post("/verifyOTP", async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  await OTP.deleteOne({ email }); // Remove OTP after successful verification
  res.json({ success: true, message: "OTP verified!", token: "someAuthToken" });
});

// resetPassword
app.post("/resetPassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and token are required",
      });
    }

    // 3. Find user by email
    const user = await UserModel.findOne({ mailId: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Update user password
    user.password = hashedPassword;
    await user.save();

    // 6. Respond with success
    res.json({
      success: true,
      message: "Password reset successfully",
    });
    console.log("resetPassword Successfully Done!");
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during password reset",
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete the user
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//  delete image
app.post("/delete", async (req, res) => {
  let { formData } = req.body;
  console.log(formData);
  await cloudinary.uploader.destroy(formData);
  const deleteIamge = await ImageModel.deleteOne({ imgId: formData });
  res.send();
});

app.post("/delete_res", async (req, res) => {
  let { formData } = req.body;
  // console.log(formData);
  await cloudinary.uploader.destroy(formData);
  const deleteIamge = await ResImageModel.deleteOne({ imgId: formData });
  // console.log(deleteIamge);
  res.send();
});

// delete dishes from frontend / backend/ cloudinary
app.post("/delete_dishes", async (req, res) => {
  let { formData } = req.body;
  await cloudinary.uploader.destroy(formData);
  const delete_dishes = await DishImageModel.deleteOne({ imgId: formData });
  res.send();
});

// update the model
app.post("/update", upload.single("image"), async (req, res) => {
  try {
    const { name, price, imgId, category } = JSON.parse(req.body.formData);
    const updateData = { name, price, category };

    if (req.file && imgId) {
      updateData.imageURL = req.file.path;
      await cloudinary.uploader.destroy(imgId);
      updateData.imgId = req.file.filename;
    }

    const updateItem = await ImageModel.findOneAndUpdate(
      { imgId },
      updateData,
      { new: true }
    );
    res.json(updateItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating item", err });
  }
});

// res data update
app.post("/update_res", upload.single("image"), async (req, res) => {
  try {
    const { name, location, star, item_Name, imgId } = JSON.parse(
      req.body.formData
    );
    const updateData = { name, location, star, item_Name };
    console.log("Try to update");

    if (req.file && imgId) {
      updateData.imageURL = req.file.path;
      await cloudinary.uploader.destroy(imgId);
      updateData.imgId = req.file.filename;
    }

    const updateItem = await ResImageModel.findOneAndUpdate(
      { imgId },
      updateData,
      { new: true }
    );

    if (!updateItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Updated Item:", updateItem);
    res.json(updateItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating item", err });
  }
});

// update dishes items
app.post("/update_dishes", upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, price, status } = JSON.parse(
      req.body.formData
    );
    const updateData = { name, category, description, price, status };
    console.log("Try to update");

    if (req.file && imgId) {
      updateData.imageURL = req.file.path;
      await cloudinary.uploader.destroy(imgId);
      updateData.imgId = req.file.filename;
    }

    const updateItem = await DishImageModel.findOneAndUpdate(
      { imgId },
      updateData,
      { new: true }
    );

    if (!updateItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Updated dishes:", updateItem);
    res.json(updateItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating dishes", err });
  }
});

// get item from db
app.get("/getDbItem", async (req, res) => {
  const getdata = await ImageModel.find();
  res.send(getdata);
});

// get restaurant from db
app.get("/getDbResItem", async (req, res) => {
  const Resgetdata = await ResImageModel.find();
  res.send(Resgetdata);
});

// get dishes from db
app.get("/getDbDishes/:id", async (req, res) => {
  const { id } = req.params; //new data add
  const Dishesdata = await DishImageModel.find({ id });
  res.send(Dishesdata);
});

// get data based on there id
app.get("/getDbResItem/:id", async (req, res) => {
  const Resgetdata = await ResImageModel.findById(req.params.id);
  res.send(Resgetdata);
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await ResImageModel.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants", error });
  }
});

app.get("/dishes", async (req, res) => {
  try {
    const dishes = await DishImageModel.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dishes", error });
  }
});

// get restaurant by product name
app.get("/getRestaurantByProduct", async (req, res) => {
  try {
    const productName = req.query.name;

    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const dishes = await DishImageModel.find({ name: productName });

    if (dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found" });
    }

    const restaurantIds = dishes.map((dish) => dish.id);
    const restaurants = await ResImageModel.find({
      _id: { $in: restaurantIds },
    });

    // Map restaurant data with corresponding dish image
    const restaurantData = restaurants.map((restaurant) => {
      // Find the first dish belonging to this restaurant
      const dish = dishes.find(
        (d) => d.id.toString() === restaurant._id.toString()
      );

      return {
        _id: restaurant._id,
        name: restaurant.name,
        location: restaurant.location,
        star: restaurant.star,
        dishImage: dish ? dish.imageURL : "", // Add dish image here
      };
    });
    res.json(restaurantData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

//------------------------ agent dashboard -----------------------------//
// update the state of action
app.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { agentDetails } = req.body; // Get agent details from request

    // Find order and update OTP
    const order = await OrderModel.findByIdAndUpdate(
      id,
      {
        OrderStatus: "Pending",
        agentDetails: agentDetails, // Add this line
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order); // ✅ Send updated order to frontend
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/orders/:id/ship", async (req, res) => {
  try {
    const { id } = req.params;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("newwwwwwwwwwwwwwwOTp:", newOtp);

    const order = await OrderModel.findByIdAndUpdate(
      id,
      {
        deliveryOtp: newOtp,
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    // Just return updated order and OTP message immediately
    res.json({ message: "OTP sent to user email", order });

    // Send OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaymanavadariya64@gmail.com",
        pass: "sukn ccbi dqbv mazt",
      },
    });

    const mailOptions = {
      from: "jaymanavadariya64@gmail.com",
      to: order.mailId,
      subject: "Your Delivery OTP",
      html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Verify Your Order</h1>
              </div>

              <!-- Body -->
              <div style="padding: 20px;">
                <p style="font-size: 16px; line-height: 1.5;">
                  Hello <strong>${order.userName}</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  Please use the following OTP to confirm your order delivery:
                </p>

                <!-- OTP Section -->
                <div style="font-size: 24px; font-weight: bold; background-color: #f1f8e9; color: #4CAF50; text-align: center; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  ${newOtp}
                </div>

                <p style="font-size: 16px; line-height: 1.5;">
                  Do not share this OTP with anyone. It is valid for a limited time.
                </p>
              </div>

              <!-- Footer -->
              <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 14px; color: #777;">
                <p>Need help? Reach out at <a href="mailto:support@foodyy.com" style="color: #4CAF50; text-decoration: none;">support@foodyy.com</a></p>
                <p>Thank you for ordering with <strong>Foodyy</strong>!</p>
              </div>
            </div>
            `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
      res.json({ message: "OTP sent to user email", order });
    });
  } catch (error) {
    console.error("Error shipping order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify OTP
app.post("/orders/verify", async (req, res) => {
  const { orderId, otp } = req.body;
  try {
    const order = await OrderModel.findById(orderId);
    console.log("order", order);

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.deliveryOtp === otp) {
      order.OrderStatus = "Delivered";
      await order.save();
      res.json({ message: "Order delivered successfully" });
      console.log("HI");
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, deliveryCharge, address, selectedRestaurant } = req.body;
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    let decoded; // Declare decoded outside the try block

    // Decode token to get user info
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      // console.log(decoded);
      console.log(
        "The issue occurs when the token was created more than an hour ago, causing it to become invalid."
      );
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await UserModel.findById(decoded.id); // Fetch user from database

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lineItems = cart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Convert to paise
        // unit_amount: item.price  // Convert to paise
      },
      quantity: item.count,
    }));

    if (deliveryCharge > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charge" },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.mailId, // Auto-fills email in Stripe checkout
      client_reference_id: user._id.toString(), // Optional for tracking orders
      mode: "payment",
      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-failed",
      line_items: lineItems,
      metadata: {
        address: address,
        userName: user.userName,
        restaurantName: selectedRestaurant.name, // Include restaurant name
        restaurantLocation: selectedRestaurant.location, // Include restaurant location
      },
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/check-payment-status", async (req, res) => {
  try {
    const { session_id } = req.query;

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      res.json({ status: "paid", session });
    } else {
      res.json({ status: "unpaid" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/createOrder", async (req, res) => {
  try {
    const {
      OrderId,
      userName,
      mailId,
      Address,
      OrderedItems,
      totalAmount,
      PaymentStatus,
      // OrderStatus,
      // action,
      restaurantName,
      restaurantLocation,
    } = req.body;

    // Generate a unique Order ID (optional)
    // const OrderId = `ORD-${Date.now()}`;

    const newOrder = new OrderModel({
      OrderId,
      userName,
      mailId,
      Address,
      OrderedItems,
      totalAmount,
      PaymentStatus,
      // OrderStatus,
      // action,
      restaurantName,
      restaurantLocation,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order creation failed:", error);
    res
      .status(500)
      .json({ message: "Server error while placing order", error });
  }
});
app.get("/get-session-details", async (req, res) => {
  try {
    const { session_id } = req.query;
    // Retrive the stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
    // send session details, including customers_email
    res.json({
      customer_email: session.customer_email,
      line_items: session.line_items.data,
      metadata: session.metadata,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getOrders/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await OrderModel.find({ mailId: email });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/send-payment-success-email", async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Retrieve the Stripe session to get customer email and cart details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const userEmail = session.customer_email;
    const cart = session.line_items.data.map((item) => ({
      name: item.description,
      price: item.amount_total / 100, // Convert back to currency
      count: item.quantity,
    }));

    // Send the email
    await sendPaymentSuccessEmail(userEmail, cart);

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to send email
const sendPaymentSuccessEmail = async (userEmail, cart) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaymanavadariya64@gmail.com",
        pass: "sukn ccbi dqbv mazt",
      },
    });

    const itemsList = cart
      .map((item) => `<li>${item.name} - ₹${item.price} x ${item.count}</li>`)
      .join("");

    const mailOptions = {
      from: "jaymanavadariya64@gmail.com",
      to: userEmail,
      subject: "Payment Successfull - Your Order is Confirmed!",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Thank you for your payment!</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; line-height: 1.5;">Your order has been successfully processed.</p>
        <h3 style="font-size: 20px; color: #4CAF50; margin-bottom: 10px;">Order Summary:</h3>
        <ul style="font-size: 14px; line-height: 1.6; list-style-type: none; padding: 0;">
          ${itemsList}
        </ul>
        <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">We will notify you once your order is dispatched.</p>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 14px; color: #777;">
        <p>If you have any questions, feel free to contact us at <a href="mailto:support@foodyy.com" style="color: #4CAF50; text-decoration: none;">support@foodyy.com</a>.</p>
      </div>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Payment success email send to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// ----------------------- Payment----------------------------//
app.get("/payment-success", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrive(
      req.query.session_id
    );
    if (session.payment_status === "paid") {
      await Order.updateOne({ sessionId: session.id }, { status: "Paid" });
      res.json({ message: "Payment was successfull", session });
    } else {
      res.status(400).json({ message: "Payment not complate" });
    }
  } catch (error) {
    console.error("Error verifing payment ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/update-profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { userName, mailId, phone, address } = req.body;
    user.userName = userName;
    user.mailId = mailId;
    user.phone = phone;
    user.address = address;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------- Agent ----------------------------//

// Register Agent
app.post("/register", async (req, res) => {
  try {
    const { agentName, mailId, password, phone, address } = req.body;
    if (!agentName || !mailId || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAgent = await AgentModel.findOne({ mailId });
    if (existingAgent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newAgent = new AgentModel({
      agentName,
      mailId,
      password,
      phone,
      address,
    });
    await newAgent.save();
    // Generate JWT Token
    const agentToken = jwt.sign({ newAgent: newAgent._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "Agent registered successfully",
      agentToken,
      agent: newAgent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

//  Login Agent
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const agent = await AgentModel.findOne({ mailId: email });

    if (!agent) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    console.log("hi1");

    // Generate JWT Token
    const agentToken = jwt.sign({ agent: agent._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("hi2");

    res.json({ message: "Login successful", agentToken, agent: agent });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get All Agents
app.get("/agents", async (req, res) => {
  try {
    const agents = await AgentModel.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// delete the agents
app.delete("/deleteAgent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await AgentModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

app.post("/deleteAgents", async (req, res) => {
  try {
    const { agentIds } = req.body;

    await AgentModel.deleteMany({ _id: { $in: agentIds } });
    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

