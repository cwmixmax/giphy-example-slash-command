'use strict';
const request = require('request');
const zlib = require('zlib');
const baseAPI = 'https://api.stackexchange.com/2.2';

// The StackExchange API always returns a compressed response (we will use gzip)
// Uncompress and move along
function parseCompressedBody(body, cb) {
  try {
    zlib.unzip(body, (err, body) => {
      cb(err, JSON.parse(body.toString()));
    });
  } catch (err) {
    cb(err, null);
  }
}

class Stackoverflow {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  get(id, cb) {
    return id;
  }

  search(s, limit, cb) {
    const requestUrl = `${baseAPI}/similar?key=${this.apiKey}&site=stackoverflow&order=desc&sort=relevance&filter=default&title=${s}&pagesize=${limit}&page=1`;
    const requestOptions = {
      url: requestUrl,
      encoding: null,
      headers: {
        'Accept-Encoding': 'gzip'
      }
    };

    request(requestOptions, (err, response, body) => {
      parseCompressedBody(body, (err, body) => {
        cb(err, body);
      });
    });
  }
};

module.exports = Stackoverflow;