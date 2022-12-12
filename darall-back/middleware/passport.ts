const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const secretKey = process.env.SECRET_KEY;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
  secretOrKey: secretKey,
};

module.exports = passport => {
  passport.use('jwt', new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }))
};