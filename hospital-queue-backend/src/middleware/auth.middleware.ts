import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUser } from "../types";
import { ENV } from "../constant/commonConstant/commonConstant";
import { ERRORS } from "../constant/errorConstant/errorConstant";
import { extractToken } from "../utils/commonMethod";

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export const roleMiddleware = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(ERRORS.FORBIDDEN.status)
        .json({ error: ERRORS.FORBIDDEN.message });
    }
    next();
  };

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res
        .status(ERRORS.UNAUTHORIZED.status)
        .json({ error: ERRORS.UNAUTHORIZED.message });
    }

    req.user = jwt.verify(token, ENV.JWT_SECRET) as JwtUser;
    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(ERRORS.TOKEN_EXPIRED.status)
        .json({ error: ERRORS.TOKEN_EXPIRED.message });
    }
    return res
      .status(ERRORS.INVALID_OR_EXPIRED_TOKEN.status)
      .json({ error: ERRORS.INVALID_OR_EXPIRED_TOKEN.message });
  }
};
