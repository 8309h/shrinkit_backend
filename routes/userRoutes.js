const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter.use((req, res, next) => {
  console.log("📍 USER ROUTER HIT:", req.method, req.originalUrl);
  next();
});

userRouter.post("/signup",userController.signup);
userRouter.post("/login", userController.login);
userRouter.post("/newtoken", userController.newtoken);

userRouter.get("/allusers", userController.getAllUsers);
userRouter.get("/logout", authenticate, userController.logout);
userRouter.delete("/delete/:id", userController.deleteUser);
userRouter.patch("/updateName", userController.updateName);
userRouter.patch("/updatePassword/:id", userController.updatePassword);

module.exports = userRouter;
