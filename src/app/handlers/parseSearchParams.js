const toSearchParams = (searchParams) => {
  let entries = {};
  for (const [key, value] of searchParams.entries()) {
    entries[key] = value;
  }
  return entries;
};

const parseSearchParams = (request, response, next) => {
  const url = new URL(`http://${request.headers.host}${request.url}`);
  request.searchParams = toSearchParams(url.searchParams);
  next();
};

module.exports = { parseSearchParams, toSearchParams };
