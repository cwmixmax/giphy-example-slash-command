'use strict';
var Stackoverflow = require('../utils/stackoverflow');
var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  let so = new Stackoverflow(key);

  // TODO: technically, somebody could just quickly type a number here
  // this would try to resolve that to a question ID...
  // may or may not be intended behaviour
  if (!isNaN(term)) {
    so.get(term, (err, question) => {
      if (err || !question || !question.items || question.items.length === 0) {
        return res.status(500).send('Error');
      }

      const htmlResponse = convertQuestionToResponse(question.items[0]);
      res.json({
        body: htmlResponse
      });
    });
  } else {
    so.search(term, 1, (err, response) => {
      if (err || !response || !response.items || response.items.length === 0) {
        return res.status(500).send('Error');
      }

      const htmlResponse = convertQuestionToResponse(response.items[0]);
      res.json({
        body: htmlResponse
      });
    });
  }
};

function convertQuestionToResponse(question) {
  const colour = question.is_answered ? 'green' : 'red';
  const answerLabel = question.answer_count == 1 ? 'Answer' : 'Answers';

  return `<a href="${question.link}" style="font-family: Roboto; color: ${colour}; font-size: 1em;">${question.title} (${question.answer_count} ${answerLabel})</a>`;
}