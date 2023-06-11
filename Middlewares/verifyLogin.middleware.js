import jwt from "jsonwebtoken";
// Middleware
const verifyLoginMiddleware = async (req, res, next) => {
  try {
    const headersToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(headersToken, process.env.JWT_SECRET_KEY);
    req.username = decoded.userName;
    req.userID = decoded.userID;
    req.userRole = decoded.userRole;
    console.log(req.userRole);
    next();
  } catch (err) {
    res.status(401).send("Failed To Verify Login");
  }
};

// Export
export default verifyLoginMiddleware;
