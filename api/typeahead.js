'use strict';
var Stackoverflow = require('../utils/stackoverflow');
var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  let so = new Stackoverflow(key);
  so.search(term, 10, (err, response) => {
    if (err || !response) {
      res.status(500).send('Error');
      return;
    }

    let results = response.items.map((question) => {
      const colour = question.is_answered ? 'green' : 'red';
      const answerLabel = question.answer_count == 1 ? 'Answer' : 'Answers';

      return {
        title: `<a href="${question.link}" style="font-family: Roboto; color: ${colour}; font-size: 1em; display: inline-block;">${question.title} (${question.answer_count} ${answerLabel})</a>`,
        text: question.question_id
      };
    });

    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });
};
