import { AppError } from "../utils/index.js";

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    next(new AppError("Access denied: Admin role required", 403));
  }
};

export default isAdmin;
