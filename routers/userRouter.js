import express from "express";
import { changePassword, createUser, getUserData, googleLogin, loginUser, sendOTP, updateUserData, verifyOTPAndResetPassword, getAllUsers, toggleBlockUser, toggleUserRole, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser)
userRouter.post("/login" , loginUser)
userRouter.get("/me", getUserData)
userRouter.put("/", updateUserData)
userRouter.put("/password", changePassword)
userRouter.post("/google-login", googleLogin)
userRouter.post("/send-otp", sendOTP)
userRouter.post("/verify-otp", verifyOTPAndResetPassword)
userRouter.get("/", getAllUsers)
userRouter.put("/:email/block", toggleBlockUser)
userRouter.put("/:email/role", toggleUserRole)
userRouter.delete("/:email", deleteUser)

export default userRouter;