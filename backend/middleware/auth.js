import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Please Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || "random@234");
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.json({ success: false, message: "Invalid or expired session. Please log in again." });
    }
};

export default authMiddleware;
