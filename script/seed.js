/** @format */
const challengeNames = [
  'Bottle',
  'Vending machine',
  'Beverage can',
  'Fire hydrant',
  'Manhole cover',
  'Bench',
  'Mailbox',
  'Mouse',
  'Laptop',
  'Stop sign',
  'Horse',
  'Dog',
  'Waste container',
  'Fountain',
  'Flower',
  'Traffic light',
  'Cone',
];
const userNames = ['Cody', 'murphy', 'larry', 'joe', 'laura', 'jose'];

const {
  db,
  models: { User },
} = require('../server/db/index');
const Challenge = require('../server/db/models/challenges');
const Followers = require('../server/db/models/followers');
User;
/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');
  let users = [];
  // Creating Users
  for (let i = 0; i < userNames.length; i++) {
    const user = await User.create({
      username: userNames[i],
      password: '123',
      email: `${userNames[i]}@email.com`,
      biography: 'I am a generated fake user.',
    });
    users.push(user);
  }
  console.log(`seeded users ${users.length}`);
  for (let j = 0; j < challengeNames.length; j++) {
    const challenge = await Challenge.create({
      name: challengeNames[j],
      difficulty: 'easy',
      score: j * 2 + 5,
      description: 'Everyday items you can find easy.',
    });
    const achievement = await users[1].addChallenge(challenge);
    await achievement[0].update({
      img_url:
        'https://t4.ftcdn.net/jpg/03/54/26/09/360_F_354260981_mvf4Yt39tO1iAWkXeFcPayv0OkTw6p4j.jpg',
    });
  }
  // Friends
  await users[3].addFollowers(1);
  await users[2].addFollowers(1);
  console.log(`seeded challenges ${challengeNames.length}`);
  console.log(`seeded successfully`);
  return 'Data seeded';
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
