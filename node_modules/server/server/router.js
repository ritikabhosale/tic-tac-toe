class Router {
  #handlers;
  constructor() {
    this.#handlers = [];
  }

  #isHandlerMatching(handler, { method, url }) {
    const matchWith = new RegExp(handler.url);
    if (handler.method) {
      return url.match(matchWith) && method === handler.method;
    }
    return url.match(matchWith);
  }

  #getMatchingHandlers(request) {
    return this.#handlers.filter(handler => {
      return this.#isHandlerMatching(handler, request)
    });
  };

  #createNext([...handlers]) {
    const next = (req, res) => {
      const currentHandler = handlers.shift();
      if (currentHandler) {
        currentHandler.handler(req, res, () => next(req, res));
      }
    };
    return next;
  };

  createRouter() {
    return (req, res) => {
      const handlers = this.#getMatchingHandlers(req);
      const next = this.#createNext(handlers);
      next(req, res);
    };
  };

  middleware(handler) {
    this.#handlers.push({ handler, url: '/.*' });
  };

  get(url, handler) {
    this.#handlers.push({ handler, method: 'GET', url });
  }

  post(url, handler) {
    this.#handlers.push({ handler, method: 'POST', url });
  }
}

module.exports = { Router };
