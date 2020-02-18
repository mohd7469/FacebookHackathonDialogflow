'use strict';

const axios = require('axios');
const express = require('express');
const router = express.Router();
const dialogflow = require('dialogflow');
const {WebhookClient} = require('dialogflow-fulfillment');

const localStorage = require('local-storage');
localStorage.set('brotherAppletKey', null);
localStorage.set('sisterAppletKey', null);

const iftttEvent = 'call_phone';
const iftttBaseUrl = `https://maker.ifttt.com/trigger/${iftttEvent}/with/key/`;
const iftttKey = 'd4cxtJXjAKGJdNvr4Gpz2WiWfFIX-3AHUOtS10bGKPs';
const iftttURL = iftttBaseUrl + iftttKey;

router.get('/', (req, res, next) => {
  res.send(`Server is up and running.`);
});

router.post('/webhook', (req, res, next) => {

  // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const agent = new WebhookClient({request: req, response: res});

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
  }

  function findPhone(agent) {
    const { phoneType } = agent.parameters;
    return axios.get(iftttURL)
      .then(function (response) {
        const { data } = response;
        console.log(`\n`);
        console.log(data);
        console.log(`\n`);
        return agent.add(`Hold on, let's give it a call :: ${phoneType}`);
      })
      .catch(function (error) {
        console.log(error);
        return agent.add(`I'm sorry, can you try again?`);
      });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Find Phone', findPhone);
  agent.handleRequest(intentMap);

});

module.exports = router;
