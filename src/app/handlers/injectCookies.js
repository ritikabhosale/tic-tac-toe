const parseCookies = cookiesAsString => {
  const cookies = {};
  if (cookiesAsString) {
    cookiesAsString.split(';').forEach(cookieAsString => {
      const [name, value] = cookieAsString.split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

const injectCookies = (request, response, next) => {
  const cookiesAsString = request.headers.cookie;
  const cookies = parseCookies(cookiesAsString);
  request.cookies = cookies;
  next();
};

module.exports = { injectCookies };
