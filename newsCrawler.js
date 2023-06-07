const axios = require('axios');
const cheerio = require('cheerio');
const redis = require('redis');
const getChannel = require('./rabbitmq');

const client = redis.createClient();

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

client.on('connect', function() {
    console.log('Connected to Redis');
});

module.exports.getArticles = async (url) => {
    try {        
        const newsArr = await getNewsLinks(url);

        let articlesPromises = newsArr.map(url => getArticleDetails(url));
        let articles = await Promise.all(articlesPromises);                        
                
        console.log(`Total articles: ${articles.length}`);
        return articles;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const getNewsLinks = async (url) => {
    let newsArr = [];    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let aArr = $('a');

    aArr.each((index, element) => {
        if (element.attribs.href.includes("v.daum.net") && !element.attribs.href.includes("gallery")) {
            if(!newsArr.includes(element.attribs.href)) {                
                newsArr.push(element.attribs.href);
            }                
        }
    });

    return newsArr;
};

const getArticleDetails = async (url) => {
    try {
        const cachedData = await client.get(url);
        if (cachedData) {
            console.log('from redis: ' + url);
            return JSON.parse(cachedData);
        }
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        let title = $('.tit_view').text();
        let articleView = $('.article_view');
        let allParagraphs = articleView.find('p');
        let paragraphs = allParagraphs.filter((i, el) => !$(el).hasClass('link_figure')).map((i, el) => $(el).text()).get();
        let category = $('section.inner-main h2.screen_out').text();
        let press = $('#kakaoServiceLogo').text();
        let reporter = $('.info_view .txt_info').first().text();
<<<<<<< HEAD
        let platform = "daum";
=======
>>>>>>> a90f75b403c04e16e47248c71ef950fec9d8bb40
        console.log(`Title: ${title}\n`);
        console.log(`Paragraphs: ${paragraphs.join('\n')}\n`);
        console.log(`Category: ${category}\n`);
        console.log(`Press: ${press}\n`);
        console.log(`Reporter: ${reporter}\n`);
        const articleDetails = {
            title: title,
            paragraphs: paragraphs,
            category: category,
            press: press,
<<<<<<< HEAD
            reporter: reporter,
            platform: platform
=======
            reporter: reporter
>>>>>>> a90f75b403c04e16e47248c71ef950fec9d8bb40
          };
          
          await client.set(url, JSON.stringify(articleDetails));

          const channel = await getChannel();
          channel.sendToQueue('daum', Buffer.from(JSON.stringify(articleDetails)));

          return articleDetails;

    } catch (error) {
        console.error(`Error occurred while processing ${url}: ${error.message}`);
    }
}

