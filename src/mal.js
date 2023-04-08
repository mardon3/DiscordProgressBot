const request = require('request');
const cheerio = require('cheerio');

function getAnimeList(user, url, callback) {
  const list_url = `https://myanimelist.net/animelist/${user}?status=${url}`;

  // Use the request library to fetch the HTML content of the page
  request(list_url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Parse the HTML content using Cheerio
      const $ = cheerio.load(body);

      // Use Cheerio to find all elements with the class "list-table"
      const table_rows = $('table');

      // Access the value of the "data-items" attribute
      const data_items = table_rows.attr('data-items');

      // Convert to JSON
      const data_items_json = JSON.parse(data_items);

      // Initialize empty object for storing animes and their scores
      const name_and_score = {};

      // Loop through each element and store the anime title and score
      data_items_json.forEach(item => {
        const airing_status = String(item.anime_airing_status);
        let anime_title;
        if (item.anime_media_type_string === 'Movie') {
          anime_title = item.anime_title + ' --(MOVIE)';
        } else if (airing_status === '2') {
          anime_title = item.anime_title + ' --(DONE)';
        } else {
          anime_title = item.anime_title + ' --(AIRING)';
        }
        const anime_score = item.anime_score_val;
        if (anime_score === 0) {
          return;
        }
        name_and_score[anime_title] = anime_score;
      });

      // Convert the object to an array and sort it by score
      const names_and_score_sorted = Object.entries(name_and_score).sort((a, b) => a[1] - b[1]);

      // Create a string to store the anime titles and scores
      let message = '';

      // Iterate over the sorted array and append the anime title and score to the string
      names_and_score_sorted.forEach(anime => {
        const string_list = anime.map(String);
        message += `${string_list.join(': ')}\n`;
      });

      // Invoke the callback with the message string
      callback(null, message);
    } else {
      callback(error);
    }
  });
}

module.exports = {
  getAnimeList: getAnimeList
};
