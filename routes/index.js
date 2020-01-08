const { Router } = require('express');

const appRouter = new Router();

const PageViewsService = require('../services/PageViews');
const pageViewsHandler = new PageViewsService();

const appRoutes = [
  {
    method: 'get',
    path: '/page-views',
    handler: pageViewsHandler.list,
  },
  {
    method: 'put',
    path: '/page-views',
    handler: pageViewsHandler.create,
  },
  {
    method: 'get',
    path: '/returned-users',
    handler: pageViewsHandler.getReturnedUsers
  }
];

const initRoutes = ({ method, path, handler }) => {
  return appRouter[method](
    path,
    (req, res, next) => {
      const result = handler(req);

      if (!result) {
        next(new Error(`Request data is ${result}.`));
      }

      if (typeof result.then === 'function') {
        result.then((data) => {
          res.send(data);
          next();
        }).catch((err) => {
          next(err);
        });
      } else {
        res.send(result);
        next();
      }
    }
  );
};


appRoutes.map(initRoutes);

module.exports = {
  appRouter
};
