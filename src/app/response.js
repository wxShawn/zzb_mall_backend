module.exports = {
  async sucsses(ctx, { status, message, result }) {
    ctx.status = status;
    ctx.body = {
      code: 0,
      message,
      result,
    }
    return true;
  },

  async error(ctx, { status, message, result }) {
    ctx.status = status;
    ctx.body = {
      code: -1,
      message,
      result,
    }
    return false;
  }
}