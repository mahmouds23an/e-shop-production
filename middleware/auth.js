import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!token_decode) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = {
      id: token_decode.id,
      name: token_decode.name,
    };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;
