import express from "express";

import sessionMiddleware from "../../../infrastructure/middleware/session";
import passport from "../../../infrastructure/middleware/passport";

export const setMiddleware = (app: express.Express) => {
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
};
