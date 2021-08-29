const needle = require('needle');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app     = express();
const request = require('request');

//`https://www.avito.ru${$('div[data-marker = catalog-serp]>div[data-marker = item]>.iva-item-content-m2FiN>.iva-item-body-NPl6W>.iva-item-titleStep-2bjuh>a').attr("href")}`)

const TOKEN = '1926731720:AAE-mYixPbnnhLRGU0NqDwvs_4AL0XNACqg';

let URL = 'https://www.avito.ru/simferopol/nastolnye_kompyutery?geoCoords=44.948314%2C34.100192&pmax=30000&radius=25&s=104&user=1';
let URL2 = 'https://www.avito.ru/simferopol/tovary_dlya_kompyutera?f=ASgBAgECAUT4vA2Y0jQBRcaaDBV7ImZyb20iOjAsInRvIjoyMDAwMH0&geoCoords=44.948314%2C34.100192&radius=25&s=104&user=1';

const bot = new TelegramBot(TOKEN, {
    polling: true
  });

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
      var result = 'App is running'
      response.send(result);
  }).listen(app.get('port'), function() {
      console.log('App is running, server is listening on port ', app.get('port'));
  });

let result = '';
let result2 ='';



setInterval(function(){request('http://api.scrapestack.com/scrape?access_key=7d6251394aa6a4d06a233b6b5b55c792&url=https://www.avito.ru/simferopol/nastolnye_kompyutery?geoCoords=44.948314%2C34.100192&pmax=30000&radius=25&s=104&render_js=0&proxy_location=ru', function (err, res, body){
  //console.log(res.body);
  //if (err) return;
  let $ = cheerio.load(res.body);
  //console.log($('div[data-marker = catalog-serp]>div[data-marker = item]'))
  console.log(`https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`)    
  }
  )}, 500);