import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "random@234");
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide both email and password" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist. Please register first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, user: { name: user.name, email: user.email } });

    } catch (error) {
        console.log("Login error:", error);
        res.json({ success: false, message: "Login failed. Please try again." });
    }
};

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all required fields" });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, user: { name: user.name, email: user.email } });

    } catch (error) {
        console.log("Registration error:", error);
        res.json({ success: false, message: "Registration failed. Please try again." });
    }
};

export { loginUser, registerUser };
