const path = require("path");

//const express = require('express');
import express, { Request, Response, NextFunction } from "express";

//const mongoose = require('mongoose');
import mongoose from "mongoose";
//const multer = require('multer');
import multer from "multer";

// const feedRoutes = require('./routes/feed');
// const authRoutes = require('./routes/auth');

import feedRoutes from "./routes/feed";
import authRoutes from "./routes/auth";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "images");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(express.urlencoded({ extended: true })); // ommits body parser
app.use(express.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use('/feed', feedRoutes);
// app.use('/auth', authRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb://localhost:27017/messages?retryWrites=true&w=majority"
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then((result) => {
    console.log("Mongoose connect listen on port 8080.");
    app.listen(8080);
  })
  .catch((err) => console.log(err));
