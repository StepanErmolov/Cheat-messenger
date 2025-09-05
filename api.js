const http = require('http');
const url = require('url');
const fs = require('fs');

//общий класс управления чатом, сделал все через методы, чтобы удобнее выглядело
class ChatManager {
	constructor() {
	  this.history = [[], [], []];
	  this.chat = 0;
	}

	save_history() {
		fs.writeFile('history.json', JSON.stringify(this.history), err => {
			if (err) console.error(err);
			else console.log('history has been rewritten');
		}
	}

	load_history() {
		this.history = JSON.parse(fs.readFileSync('history.json'));
	}

	check(chat) {
		return (chat < 0 || chat >= this.history.length) ? 0 : this.history[chat];
	}
	
	send(msg) {
		return (chat < 0 || chat >= this.history.length) ? 0 : this.history[this.chat].push(msg);
	}

	get_msg(chat, n) {
		return ((chat < 0 || chat >= this.history.length) || (n < 0 || n >= this.history[chat].length)) 
		? 0 : this.history[chat][n];
	}

	login(user) {
	  if (user.length >= 2 && user.length <= 20) {
		this.make_ai_chat(user);
	  }
	}
  
	make_ai_chat(user) {
	}
  }
  
  const chatManager = new ChatManager();

  const server = http.createServer((req, res) => {
	try {
	  const parsed = url.parse(req.url, true);
  
	  if (req.method === 'GET') {
		if (parsed.pathname === '/check') {
		  const chat = parseInt(parsed.query.chat);
		  const result = chatManager.check(chat);
		  res.writeHead(200, { 'Content-Type': 'application/json' });
		  res.end(JSON.stringify(result));
		} else if (parsed.pathname === '/get') {
		  const chat = parseInt(parsed.query.chat);
		  const n = parseInt(parsed.query.n);
		  const msg = chatManager.get_msg(chat, n);
		  if (msg === 0) {
			res.writeHead(400, { 'Content-Type': 'text/plain' });
			res.end(':(((');
		  } else {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(msg));
		  }
		} else {
		  res.writeHead(404, { 'Content-Type': 'text/plain' });
		  res.end(':(');
		}
	  } else if (req.method === 'POST') {
		let body = '';
		req.on('data', chunk => {
		  body += chunk.toString();
		});
  
		req.on('end', () => {
		  if (parsed.pathname === '/login') {
			const user = body.trim();
			if (chatManager.login(user)) {
			  res.writeHead(200, { 'Content-Type': 'text/plain' });
			  res.end('suck ses');
			} else {
			  res.writeHead(400, { 'Content-Type': 'text/plain' });
			  res.end('invalid (who?)');
			}
		  } else if (parsed.pathname === '/send') {
			let data;
			try {
			  data = JSON.parse(body);
			} catch (e) {
			  res.writeHead(400, { 'Content-Type': 'text/plain' });
			  res.end('you');
			  return;
			}
  
			if (!data.msg) {
			  res.writeHead(400, { 'Content-Type': 'text/plain' });
			  res.end('No message provided');
			  return;
			}
  
			const result = chatManager.send(data.msg);
			if (result === 0) {
			  res.writeHead(400, { 'Content-Type': 'text/plain' });
			  res.end('No! God! Please! No!');
			} else {
			  res.writeHead(200, { 'Content-Type': 'text/plain' });
			  res.end('Fuck Yes');
			}
		  } else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not Found');
		  }
		});
	  } else {
		res.writeHead(405, { 'Content-Type': 'text/plain' });
		res.end('GO FUCK YOURSELF');
	  }
	} catch (err) {
	  console.error(err);
	  res.writeHead(500, { 'Content-Type': 'text/plain' });
	  res.end('Internal Server Error');
	}
  });
  
  server.listen(3000, () => {
	console.log('Server listening on port 3000');
  });

process.on('SIGINT', function () {
	server.close(function () {
		fs.writeFile('history.json', JSON.stringify(history), err => {
			if (err) {
				console.error(err);
			} else {
				console.log("History saved!");
			}
		});
		console.log('Server closed!');
	});
});
