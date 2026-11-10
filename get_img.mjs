import https from 'https';

https.get('https://japanese-tengsu.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    if(matches) {
       console.log(matches.slice(0, 10).join('\n'));
    }
  });
});
