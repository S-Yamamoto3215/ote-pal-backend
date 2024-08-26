import express from "express";
import passport from 'passport';

export const setMiddleware = (app: express.Express) => {
  app.use(passport.initialize());
};
