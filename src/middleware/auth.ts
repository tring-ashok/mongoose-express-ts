import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";

export default function(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header("x-auth-token");
  let payload: Payload | any;

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    payload = jwt.verify(token, config.get("jwtSecret"));
    req.userId = payload.userId;
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }

  const { userId, role } = payload;
  const newToken = jwt.sign({ userId, role }, config.get("jwtSecret"), {
    expiresIn: config.get("jwtExpiration")
  });
  res.setHeader("x-auth-token", newToken);
  next();
}
