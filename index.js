const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const json2csv = require('json2csv').Parser;
const app = express();

const movieUrl = "https://www.imdb.com/title/tt5354160/?ref_=nv_sr_srsg_0";

//this function calls itself.
(async () => {
    const data = [];

    const response = await axios(movieUrl, {
        //this headers important to pretend in real request
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7"

        }
    })
    let htmlBody = response.data;
    let $ = cheerio.load(htmlBody);
    let movieName = $(".khmuXj>h1").text();
    let rating = $(".jGRxWM").text();
    let trailer = $('.ipc-lockup-overlay.sc-5ea2f380-2.gdvnDB.hero-media__slate-overlay.ipc-focusable').attr('href');

    data.push({
        movieName, rating, trailer
    })

    const j2cp = new json2csv();
    const csv = j2cp.parse(data);

    fs.writeFileSync('./movieData.csv', csv, "utf-8")

})()




const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
})