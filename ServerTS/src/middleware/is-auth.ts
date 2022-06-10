import {Request, Response, NextFunction} from 'express';

import jwt from 'jsonwebtoken';

const isAuth = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: any = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken : any;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error: any = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
export default isAuth;
