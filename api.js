const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

//общий класс управления чатом
class ChatManager {
    constructor() {
        this.history = [[], [], []];
        this.chat = 0;
    }

    save_history() {
        try {
            fs.writeFileSync('history.json', JSON.stringify(this.history, null, 2), 'utf8');
            console.log('history saved');
        } catch (err) {
            console.error('error saving history: ', err);
        }
    }

    load_history() {
        try {
            const data = fs.readFileSync('history.json', 'utf8');
            this.history = JSON.parse(data);
            console.log('history loaded: ', this.history);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.warn('history not found');
            } else {
                console.error('error loading history: ', err);
            }
        }
    }

    check(chat) {
    return (chat >= 0 && chat < this.history.length) ? this.history[chat].length : 0;
    }

    send(chat, msg) {
        return (chat >= 0 && chat < this.history.length) ? (this.history[chat].push(msg), 1) : 0;
    }

    get_msg(chat, n) {
        return (chat >= 0 && chat < this.history.length && n >= 0 && n < this.history[chat].length)
            ? this.history[chat][n]
            : 0;
    }

}
  
const chatManager = new ChatManager();
chatManager.load_history();

app.get('/check', (req, res) => {
    console.log('GET /check вызван');
  const chat = parseInt(req.query.chat);
  if (isNaN(chat)) {
    return res.status(400).send('wrong parameters');
  }
  const result = chatManager.check(chat);
  if (result === 0) {
    return res.status(404).send('chat not found');
  }
  res.json(result);
});

app.get('/get', (req, res) => {
  const chat = parseInt(req.query.chat);
  const n = parseInt(req.query.n);
  if (isNaN(chat) || isNaN(n)) {
    return res.status(400).send('wrong parameters');
  }
  const msg = chatManager.get_msg(chat, n);
  if (msg === 0) {
    return res.status(404).send('message not found');
  }
  res.json(msg);
});

app.post('/send', (req, res) => {
  console.log('POST /send вызван: ', req.body);
  const data = req.body;
  if (!data || typeof data.msg !== 'string' || typeof data.chat !== 'number') {
    return res.status(400).send('no message or god bless america');
  }
  const result = chatManager.send(data.chat, data.msg);
  if (result === 0) {
    return res.status(400).send('fail');
  }
  res.send('message send');
});


app.use((req, res) => {
  res.status(404).send('unluck');
});

const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

process.on('SIGINT', async () => {
  console.log('\nSaving history');
  await chatManager.save_history();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

