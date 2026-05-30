import { verifyToken, AppError } from "../utils/index.js";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not authorized to access this route", 401));
    }

    try {
      const decoded = verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          title: true,
          isActive: true,
        },
      });

      if (!user) {
        return next(new AppError("User not found", 401));
      }

      if (!user.isActive) {
        return next(new AppError("User account is disabled", 403));
      }

      req.user = user;
      next();
    } catch (err) {
      return next(new AppError("Token verification failed", 401));
    }
  } catch (error) {
    next(error);
  }
};
export default protect;
