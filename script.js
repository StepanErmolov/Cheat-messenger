var name = ""
name = localStorage.getItem('username');
var base_url = "http://localhost:3000";
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
	name = base64encode(user_name);
	localStorage.setItem('username', name);
}

function add_message(msg) {
}
function send() {
	var message = {
		"sender": name,
		"text": base64encode(document.getElementById("message").value),
	};
	var request = {
		"chat": chat,
		"message": message
	};
	alert(JSON.stringify(request));
	fetch(base_url + '/send', {
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
	fetch(base_url + `/get?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(data => {
		add_message(JSON.parse(data));
		console.log(data);
	})
	.catch(error => {
		console.error('ERROR:', error);
	});

}

function check() {
	const params = new URLSearchParams({
		chat: chat
	});
	fetch(base_url + `/check?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(data => {
		var current_hist_size = JSON.parse(data).size;
		if ((history_size) != current_hist_size) {
			for (var i = history_size; i < current_hist_size; i ++) {
				get_message(i);
			}
		}
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
