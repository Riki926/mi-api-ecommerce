const userRepository = require('../repositories/user.repository');
const cartRepository = require('../repositories/cart.repository');
const { hashSync, compareSync } = require('../utils/hash');
const { signJwt, verifyJwt } = require('../utils/jwt');
const { sendPasswordReset } = require('./mail.service');

const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = hashSync(password);

  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  const newCart = await cartRepository.create({
    user: newUser._id,
    items: [],
  });

  await userRepository.updateById(newUser._id, { cart: newCart._id });

  return { uid: newUser._id };
};

const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = compareSync(password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const requestPasswordReset = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return { sent: true };
  }

  const resetToken = signJwt({ uid: user._id, type: 'reset' });

  const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${resetToken}`;

  await sendPasswordReset(user.email, resetUrl);

  return { sent: true };
};

const resetPassword = async (token, newPassword) => {
  let payload;
  try {
    payload = verifyJwt(token);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }

  if (payload.type !== 'reset') {
    throw new Error('Invalid token type');
  }

  const user = await userRepository.findById(payload.uid);

  if (!user) {
    throw new Error('User not found');
  }

  const isSamePassword = compareSync(newPassword, user.password);

  if (isSamePassword) {
    throw new Error('New password cannot be the same as the old password');
  }

  const hashedPassword = hashSync(newPassword);

  await userRepository.updateById(user._id, { password: hashedPassword });

  return { reset: true };
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
};
