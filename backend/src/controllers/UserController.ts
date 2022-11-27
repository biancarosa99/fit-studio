import express = require("express");
const router = express.Router();
// import { getAllUsers, getUser, editUser, deleteUser, changePassword } from "../services/UserService";
import { getUser } from "../services/UserService";
import { verifyToken } from "../middleware/verifyToken";

// import { verifyToken } from "../middleware/verifyToken";

router.get("/user/:id", verifyToken, getUser);
// router.get("/users/", getAllUsers);
// router.put("/users/:id", verifyToken, editUser);
// router.delete("/users/:id", verifyToken, deleteUser);
// router.put("/users/password/:id", verifyToken, changePassword);

module.exports = router;
