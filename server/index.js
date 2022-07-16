/** @format */

//server runs in expo somewhere

const { db } = require('./db');
const {
  models: { Challenge, User },
} = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');
const getFeed = require('./get-feed');
const getMessage = require('./get-message');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const weeklyChallenge = async () => {
  const challenges = await Challenge.findAll();
  await User.update({ dailyToken: 1 }, { where: { dailyToken: 0 } });
  let currentWeekChallengeNum = null;
  for (let i = 0; i < challenges.length; i++) {
    if (challenges[i].weeklyChallenge) {
      while (
        challenges[i].id === currentWeekChallengeNum ||
        currentWeekChallengeNum === null
      ) {
        currentWeekChallengeNum = Math.floor(Math.random() * challenges.length);
      }
      challenges[i].update({ weeklyChallenge: false });
      challenges[currentWeekChallengeNum].update({ weeklyChallenge: true });
    }
  }
  if (currentWeekChallengeNum === null) {
    currentWeekChallengeNum = Math.floor(Math.random() * challenges.length);
    console.log(currentWeekChallengeNum);
    challenges[currentWeekChallengeNum].update({ weeklyChallenge: true });
  }
};

const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    io.on('connection', (client) => {
      client.on('resetFeed', async (id) => {
        console.log('resetFeed RAN');
        const feed = await getFeed(parseInt(id));
        io.sockets.emit('resetFeed', feed);
      });
      client.on('resetMessage', async (id) => {
        console.log('resetMessage RAN');
        const message = await getMessage(parseInt(id));
        io.sockets.emit('resetMessage', message);
      });
      client.on('event', (data) => {
        console.log('event:', data);
      });
      client.on('disconnect', () => {
        console.log('disconnected');
      });
    });

    setInterval(() => {
      io.sockets.emit('time-msg', { time: new Date().toISOString() });
    }, 1000);

    //app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

    weeklyChallenge();
    setInterval(weeklyChallenge, 86400000);
  } catch (ex) {
    console.log(ex);
  }
};

init();
