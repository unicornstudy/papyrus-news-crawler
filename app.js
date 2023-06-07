const express = require('express');
const app = express();
const { getArticles } = require('./newsCrawler.js');
<<<<<<< HEAD
const port = 3001;
=======
const port = 3000;
>>>>>>> a90f75b403c04e16e47248c71ef950fec9d8bb40

require('./scheduler.js');

app.post('/daum/main', async (req, res) => {
    try {
        const articles = await getArticles('https://news.daum.net/');
        res.send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/daum/sports', async (req, res) => {
    try {
        const articles = await getArticles('https://sports.daum.net/');
        res.send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/daum/entertain', async (req, res) => {
    try {
        const articles = await getArticles('https://entertain.daum.net/');
        res.send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
app.listen(port, () => console.log(`News crawler app listening at http://localhost:${port}`));