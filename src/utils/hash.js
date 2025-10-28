const bcrypt = require('bcrypt');

const hashSync = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, 10);
};

const compareSync = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = {
  hashSync,
  compareSync,
};
