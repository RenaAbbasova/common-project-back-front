import React, { Component } from 'react';
import { withRouter } from '../../common/with-router';
//import { Socket } from 'socket.io';

class Chat extends Component {
	socketIOClientHandler() {
		const socket = window.io('localhost:8083');

		socket.on('connect', () =>
			console.log('Connected to socket', socket.id),
		);
		// usar referencias de react
		const messages = document.getElementById('messages');
		const form = document.getElementById('form');
		const input = document.getElementById('input');

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (input.value) {
				console.log('input', input.value);
				socket.emit('chat message', input.value);
				console.log('socket', socket);
				input.value = '';
			}
		});

		socket.on('chat message', function (msg) {
			// usar referencias de react
			const item = document.createElement('li');
			item.textContent = msg;
			messages.appendChild(item);
			// check scrolling in react
			// window.scrollTo(0, document.body.scrollHeight);
		});
	}

	componentDidMount() {
		this.socketIOClientHandler();
	}

	render() {
		return (
			<div>
				<h2>Chat</h2>
				<p>Welcome to the Chat</p>

				<ul id="messages"></ul>

				<form id="form" action="">
					<input id="input" />
					<button>Send</button>
				</form>
				<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
			</div>
		);
	}
}
//<script src="/socket.io/socket.io.js"></script>

export default withRouter(Chat);
