/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var StockDataHandler = require('../controllers/StockDataHandler');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){

      var { stock, like } = req.query;
      var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
      var stockDataHandler = new StockDataHandler();

      if(Array.isArray(stock)) {
        var stock1 = stockDataHandler.getStockData(stock[0], like, ip);
        var stock2 = stockDataHandler.getStockData(stock[1], like, ip);
        Promise.all([stock1, stock2])
          .then((stockData) => {
            stockData[0].rel_likes = stockData[0].likes - stockData[1].likes;
            stockData[1].rel_likes = stockData[1].likes - stockData[0].likes;
            delete stockData[0].likes;
            delete stockData[1].likes;
            res.json({stockData});
          })
          .catch(error => next({message: error}));
      } else {
        stockDataHandler.getStockData(stock, like, ip)
          .then((stockData) => {
            res.json({stockData});
          })
          .catch(error => next({message: error}));
      }
    });
    
};
