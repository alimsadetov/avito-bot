const needle = require('needle');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app     = express();

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


function getRandomTime(a, b){
  let random = Math.floor(Math.random( ) * (b - a + 1)) + a;
  return random;
}


bot.on('text', (msg) =>{
    if ((msg.text == 'пицца') || (msg.text == 'Пицца')){
      bot.sendMessage(msg.chat.id, `Привет, ${msg.chat.first_name}, сейчас пойдёт куча ссылок с обЪявлениями. Бот проверяет авито каждые 10 секунд.`);
      setInterval(function () {
        needle.get(URL, function(err, res){
            //console.log(res.body);
            //if (err) return;
            let $ = cheerio.load(res.body);
            //console.log($('div[data-marker = catalog-serp]>div[data-marker = item]'))
            console.log(`https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`)
            if (`https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}` !== result){
                bot.sendMessage(msg.chat.id, `https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`);
                result = `https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`
                
            }

            setTimeout(function() {
              needle.get(URL2, function(err2, res2){
                //console.log(res.body);
                //if (err2) return;
                let $ = cheerio.load(res2.body);
                console.log(`https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`)
                if (`https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}` !== result2){
                    bot.sendMessage(msg.chat.id, `https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`);
                    result2 = `https://www.avito.ru/${$('div[data-marker = catalog-serp]>div[data-marker = item]').attr("data-item-id")}`
                }
                
            });
            }, getRandomTime(25000, 40000))
            
        });
        
    }, getRandomTime(40000, 55000));
    }
    else{
      bot.sendMessage(msg.chat.id, 'Введите кодовое слово')
    };
});
