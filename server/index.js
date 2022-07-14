/** @format */

//server runs in expo somewhere

const { db } = require('./db');
const {
  models: { Challenge, User },
} = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');
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
      client.on('resetFeed', () => {
        const users = User.findAll();
        client.broadcast.emit('resetFeed', users);
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
