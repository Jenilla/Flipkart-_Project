const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const cookieOptions = () => {
  const days = Number(process.env.JWT_COOKIE_EXPIRE_DAYS) || 7;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  };
};

// Signs a JWT for the user, sets it as an httpOnly cookie, and sends the
// standard { success, user } JSON body used by every auth endpoint.
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id);

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions())
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
};

module.exports = { generateToken, sendTokenResponse, cookieOptions };
