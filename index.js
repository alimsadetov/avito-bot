const needle = require('needle');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app     = express();

const TOKEN = '1926731720:AAE-mYixPbnnhLRGU0NqDwvs_4AL0XNACqg';

let URL = 'https://www.avito.ru/respublika_krym/bytovaya_elektronika?s=104';

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





bot.on('text', (msg) =>{
    if ((msg.text == 'пицца') || (msg.text == 'Пицца')){
      bot.sendMessage(msg.chat.id, `Привет, ${msg.chat.first_name}, сейчас пойдёт куча ссылок с обЪявлениями. Бот проверяет авито каждые 10 секунд.`);
      setInterval(function () {
        needle.get(URL, function(err, res){
            if (err) throw err;
            //console.log(res.body);
            const $ = cheerio.load(res.body);
            if ((`https://www.avito.ru${$('div[data-marker = catalog-serp]>div[data-marker = item]>div>.iva-item-body-NPl6W>.iva-item-titleStep-2bjuh>a').attr("href")}` !== result) && (`https://www.avito.ru${$('div[data-marker = catalog-serp]>div[data-marker = item]>div>.iva-item-body-NPl6W>.iva-item-titleStep-2bjuh>a').attr("href")}` !== 'https://www.avito.ruundefined')){
                bot.sendMessage(msg.chat.id, `https://www.avito.ru${$('div[data-marker = catalog-serp]>div[data-marker = item]>div>.iva-item-body-NPl6W>.iva-item-titleStep-2bjuh>a').attr("href")}`);
                result = `https://www.avito.ru${$('div[data-marker = catalog-serp]>div[data-marker = item]>div>.iva-item-body-NPl6W>.iva-item-titleStep-2bjuh>a').attr("href")}`
            }
            
        });
    }, 10000);
    }
    else{
      bot.sendMessage(msg.chat.id, 'Введите кодовое слово')
    };
});