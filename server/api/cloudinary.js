/** @format */
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'hckemznha',
  api_key: '756524156741189',
  api_secret: 'IbgjGuRQjJDLAuEr1hum7VzCedM',
});

const uploadPicture = async () => {
  const reponse = await cloudinary.uploader.upload(
    './test/here.png',
    (error, result) => {
      console.log(result, error);
    }
  );
  console.log('RESPONSE!', reponse.url);
  return reponse.url;
};
console.log(uploadPicture());
module.exports = uploadPicture;
