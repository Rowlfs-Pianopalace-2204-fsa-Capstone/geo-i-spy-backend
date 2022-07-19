/** @format */

const Challenge = require('./db/models/challenges');
const User = require('./db/models/user');

const getFeed = async (id) => {
  const reponse = await User.findByPk(id, {
    attributes: ['id', 'username', 'img_url'],
    include: [
      { model: Challenge },
      {
        model: User,
        as: 'followers',
        attributes: ['id', 'username', 'img_url'],
        include: {
          model: Challenge,
        },
      },
    ],
  });

  const allFollowingAchievements = [];
  let i = 0;
  while (reponse.followers.length > i) {
    if (reponse.followers[0].challenges[0]) {
      const temp = {
        challenge: reponse.followers[0].challenges[0],
        username: reponse.followers[0].username,
        id: reponse.followers[0].id,
        img: reponse.followers[0].img_url,
      };
      allFollowingAchievements.push(temp);
      reponse.followers[0].challenges.shift();
    } else {
      reponse.followers.shift();
    }
  }
  i = 0;
  while (reponse.challenges.length > i) {
    if (reponse.challenges[0]) {
      const temp = {
        challenge: reponse.challenges[0],
        username: reponse.username,
        id: reponse.id,
        img: reponse.img_url,
      };
      allFollowingAchievements.push(temp);
      reponse.challenges.shift();
    } else {
      reponse.challenges.shift();
    }
  }
  // allFollowingAchievements.push(reponse);
  allFollowingAchievements.sort(function (x, y) {
    return (
      new Date(x.challenge.Achievement.updatedAt) -
      new Date(y.challenge.Achievement.updatedAt)
    );
  });
  console.log(allFollowingAchievements);
  return allFollowingAchievements;
};

module.exports = getFeed;
