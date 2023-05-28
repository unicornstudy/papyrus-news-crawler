const cron = require('node-cron');
const { getArticles } = require('./newsCrawler.js');

const run = async () => {
    console.log("Running scraper...");
    await getArticles('https://news.daum.net/');
    await getArticles('https://sports.daum.net/');
    await getArticles('https://entertain.daum.net/');
};

cron.schedule('*/3 * * * *', run);
