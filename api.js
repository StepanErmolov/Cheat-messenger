const http = require('http');
const url = require('url');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

//общий класс управления чатом
class ChatManager {
	constructor() {
	  this.history = [[], [], []];
	  this.chat = 0;
	}

	async save_history() 
	{
		try {
			await fs.writeFile('history.json', JSON.stringify(this.history));
			console.log('history has been rewritten');
		}
		catch (err) {
			console.error(err);
		}
	}


	async load_history() 
	{
		try {
			const data = await fs.readFileSync('history.json', 'utf-8');
			this.history = JSON.parse(data);
		} 
		catch (err) {
			console.error(err);
		}
	}

	check(chat) {
		return (chat < 0 || chat >= this.history.length) ? 0 : this.history[chat].length;
	}
	
	send(msg) { //0 - неудача, 1 - успех
		if (this.chat < 0 || this.chat >= this.history.length) return 0;
		this.history[this.chat].push(msg);
		return 1;
	}

	get_msg(chat, n) {
		return ((chat < 0 || chat >= this.history.length) || (n < 0 || n >= this.history[chat].length)) 
		? 0 : this.history[chat][n];
	}
  }
  
const chatManager = new ChatManager();
// chatManager.load_history();

app.get('/check', (req, res) => {
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
  const data = req.body;
  if (!data || typeof data.msg !== 'string') {
    return res.status(400).send('no message');
  }
  const result = chatManager.send(data.msg);
  if (result === 0) {
    return res.status(400).send('fail');
  }
  res.send('message send');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
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

