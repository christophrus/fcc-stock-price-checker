var fetch = require('node-fetch');
var Stock = require('../models/Stock');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


function StockDataHandler() {    

    var getStockPrice = (stock) => {
       return fetch(`https://api.iextrading.com/1.0/stock/${stock}/price`).then(response => response.text());
    }

    var getLikes = (stock, like, ip) => {

        if(like) {
            return Stock.findOneAndUpdate({name: stock},{$addToSet: {likes: ip}},{new: true, upsert: true, setDefaultsOnInsert: true}).exec();
        }

        return Stock.findOne({name: stock}).exec();
    }

    this.getStockData = (stock, like, ip) => {

        stock = stock.toUpperCase();

        return new Promise(async (resolve, reject) => {

            try {

                var price = await getStockPrice(stock);
                if (price == 'Unknown symbol')  {
                    reject("Stock does not exist");
                }

                var likes = await getLikes(stock, like, ip).then(val => val ? val.likes.length : 0);

                resolve({
                    stock: stock,
                    price: price,
                    likes: likes
                });

            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = StockDataHandler;