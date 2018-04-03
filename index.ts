import * as TelegramBot from 'node-telegram-bot-api';
import * as https from 'https';
import * as querystring from 'querystring';
import { TrainResponse, Watch } from './interfaces';
import { size, includes } from 'lodash';
import { TOKEN } from './env';

const token: string = TOKEN;
const bot = new TelegramBot(token, {polling: true});

const chats: string[] = ['281078066', '452403672'];

chats.forEach((chat) => {
  bot.sendMessage(chat, `You subscribed to Pasha train bot. Checking has been started!`);
});

const forWatch: Watch[] = [
  {
    from: 2200184,
    to: 2200001,
    date: '2018-04-09',
    time: '00:00',
    trains: ['078Л', '794К']
  },
  // {
  //   from: 2200001,
  //   to: 2208340,
  //   date: '2018-04-06',
  //   time: '00:00',
  //   trains: ['782К']
  // }
];


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  bot.sendMessage(chatId, 'Pasha Bot received your message');
});

const checkTrains = (watch: Watch) => {

  const postBody: string = querystring.stringify(watch);

  let buffer: string = '';

  console.log('Check trains start', new Date());

  const req = https.request({
    host: 'booking.uz.gov.ua',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Length': Buffer.byteLength(postBody)
    },
    path: '/train_search/'
  }, (res) => {

    res.on('data', (data) => {
      buffer += data
    });

    res.on('end', (data) => {
      try {
        const response: TrainResponse = JSON.parse(buffer);
        const trains = (response.data.list || []).filter((one) => includes(watch.trains, one.num));

        trains.forEach((one) => {
          if (size(one.types)) {
            chats.forEach((chat) => {
              bot.sendMessage(chat, `Free places in ${one.num}, ${one.from.station} - ${one.to.station}, ${watch.date}`);
            });
          }
        });
      } catch (e) {
        chats.forEach((chat) => {
          bot.sendMessage(chat, `BOT ERROR!!! ${e}`);
        });
      }
    });

    res.on('error', (e) => {
      console.log(e);
    })
  });

  req.write(postBody);
  req.end();
};

checkTrains(forWatch[0]);

setInterval(() => {
  checkTrains(forWatch[0]);

  // setTimeout(() => {
  //   checkTrains(forWatch[1]);
  // }, 5000);

}, 5 * 60 * 1000);
