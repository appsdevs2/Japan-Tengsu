import https from 'https';

[
  'https://japanese-tengsu.com/wp-content/uploads/2022/05/1.jpeg',
  'https://japan-tengsu.us/wp-content/uploads/2021/04/Japan-tengsu-1.jpg',
  'https://tokyorevil.com/wp-content/uploads/2021/08/Japan-Tengsu-2.jpg'
].forEach(url => {
  https.get(url, (res) => {
    console.log(url, res.statusCode);
  }).on('error', () => {});
});
