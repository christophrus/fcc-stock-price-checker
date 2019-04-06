/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var fetch = require('node-fetch');
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

var getStockPrices = async (stock, next) => {

  var ret = {};

  if (!Array.isArray(stock)) {
    stock = [stock];
  }

  for(let i=0;i<stock.length;i++) {
    ret[stock[i]] = await fetch(`https://api.iextrading.com/1.0/stock/${stock[i]}/price`).then(response => response.text()).catch(error => error)
  }

  next(ret);
}   

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){

      var stock = req.query.stock;

      getStockPrices(stock, result => {
        console.log(result);
        res.send(Array.isArray(req.query.stock));
      });
    });
    
};
