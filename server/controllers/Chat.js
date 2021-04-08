const models = require('../models');

const { Chat } = models;

const chatPage = (req, res) => {
  Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app2', { csrfToken: req.csrfToken(), chat: docs });
  });
};

const makeChat = (req, res) => {
  if (!req.body.response) {
    return res.status(400).json({ error: 'RAWR! A response is required' });
  }

  const chatData = {
    response: req.body.response,
    owner: req.session.account._id,
  };

  const newChat = new Chat.ChatModel(chatData);

  const chatPromise = newChat.save();

  chatPromise.then(() => res.json({ redirect: '/chat' }));

  chatPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured.' });
  });
  return chatPromise;
};

const getChat = (request, response) => {
  const req = request;
  const res = response;

  return Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ chat: docs });
  });
};

module.exports.chatPage = chatPage;
module.exports.getChat = getChat;
module.exports.make = makeChat;
