import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";

import Request from "../types/Request";
import User, { IUser } from "../models/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.userId;
    try {
      let user: IUser = await User.findOne({ _id: id });

      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "User not found",
            },
          ],
        });
      }

      if(roles.indexOf(user.role) > -1) next();
      else res.status(HttpStatusCodes.UNAUTHORIZED).send("Unauthorized");
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  };
};
