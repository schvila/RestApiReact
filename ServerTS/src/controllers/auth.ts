import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/user";
//test only
const http = require("http");
let size = http.maxHeaderSize;
console.log("Max HTTP Header size is", size);

const signup = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: IUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error: any = new Error(
          "A user with this email could not be found."
        );
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error: any = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
const getUserStatus = (req: any, res: Response, next: NextFunction) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const err: any = new Error("User no found.");
        err.statusCode = 500;
        throw err;
      }
      res.status(200).json({ status: user.status });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
export default {
  login,
  signup,
  getUserStatus,
};
