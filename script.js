var name = ""
name = localStorage.getItem('username');
var base_url = "http://your-url-here"
console.log(base_url);
var history_size = 0;
function base64encode(str) {
	return btoa(unescape(encodeURIComponent(str)));
}
function base64decode(str) {
	return decodeURIComponent(escape(atob(str)));
}

function set_username() {
	var user_name = document.getElementById("username").value;
	document.getElementById("username").value = '';
	name = base64encode(user_name);
	localStorage.setItem('username', name);
}

function add_message(msg, n) {
	var text = `<div class="message">
		  <div class="message-counter">${n + 1}.</div>
          <div class="username">${base64decode(msg.sender)}</div>
          <pre class="message-content">${hljs.highlightAuto(base64decode(msg.text)).value}</pre>
        </div>`;
	console.log(hljs.highlightAuto(base64decode(msg.text)).value)
	document.getElementById('chat-history').innerHTML += text;
}
function send() {
	if (document.getElementById("message").value.trim() === '') return;
	var message = {
		"sender": name,
		"text": base64encode(document.getElementById("message").value),
	};
	document.getElementById("message").value = '';
	var request = {
		"chat": chat,
		"message": message
	};
	fetch(base_url + '/api/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error('ERROR:', error);
	});
}

function get_message(n) {
	var params = new URLSearchParams({
		chat: chat,
		n: n
	});
	const xhr = new XMLHttpRequest();
	xhr.open('GET', base_url + `/api/get?${params.toString()}`, false);
	xhr.send()

	if(xhr.status === 200) {
		add_message(JSON.parse(xhr.responseText), n);
		console.log(xhr.responseText);
	} else { console.error("Cataclism happend"); }
}

function check() {
	const params = new URLSearchParams({
		chat: chat
	});
	fetch(base_url + `/api/check?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(data => {
		var current_hist_size = data;
		if ((history_size) != current_hist_size) {
			for (var i = history_size; i < current_hist_size; i ++) {
				get_message(i);
			}
		}
		history_size = current_hist_size;
		console.log(data);
	})
	.catch(error => {
		console.error('ERROR:', error);
	});
}

function scrollToBottom() {
	const chatHistory = document.getElementById('chat-history');
	chatHistory.scrollTop = chatHistory.scrollHeight;
}

const intervalId = setInterval(check, 1000);

document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && event.key === 'Enter') {
		send();
	}
});
