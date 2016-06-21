module.exports = function () {

  const conf = this.data(`${NAME}-config`);
  if (!conf) return this;

  // Should focus the first invalid field if there is.

  return this;
};
