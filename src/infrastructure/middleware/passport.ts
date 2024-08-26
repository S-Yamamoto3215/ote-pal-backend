import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserRepository } from "../../domain/repositories/UserRepository";
import { comparePassword } from "../../domain/services/helpers/bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "passwd",
    },
    async (username, password, done) => {
      try {
        const userRepository = new UserRepository();
        const user = await userRepository.findByEmail(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const isValid = comparePassword(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (error) {}
    }
  )
);
