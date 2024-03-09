import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			error: '',
			isAuthenticated: false,
		};
	}

	componentDidMount = () => {
		this.getSession();
	};

	// Get Session Method
	getSession = () => {
		//// Make a GET request to the "/api/session/" URL with "same-origin" credentials
		axios
			.get('http://localhost:8000/api/session/', { withCredentials: true })
			// .then((res) => res.json()) //// Parse the response as JSON
			.then((response) => {
				const data = response.data;
				console.log('get session', data); // Log the response data to the console
				//// If the response indicates the user is authenticated
				if (data.isAuthenticated) {
					this.setState({ isAuthenticated: true }); // Update the component's state
				} else {
					// If the response indicates the user is not authenticated
					this.setState({ isAuthenticated: false }); // Update the component's state
				}
			})
			//// Handle any errors that occurred during the fetch
			.catch((err) => {
				console.error('Error fetching session:', err);
			});
	};

	//Who Am I method
	whoami = () => {
		axios
			.get('http://localhost:8000/api/whoami/', {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			})
			.then((response) => {
				const data = response.data;
				console.log('You are logged in as: ' + data.username);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	handlePasswordChange = (event) => {
		this.setState({ password: event.target.value });
	};

	handleUserNameChange = (event) => {
		this.setState({ username: event.target.value });
	};

	isResponseOk(response) {
		if (response.status >= 200 && response.status <= 299) {
			return response.data;
		} else {
			throw new Error(response.statusText);
		}
	}

	//Login Mthod
	login = (event) => {
		event.preventDefault(); // Prevent the default form submission behavior
		// Make a POST request to the "/api/login/" URL with the form data
		axios
			.post(
				'http://localhost:8000/api/login/',
				{
					username: this.state.username,
					password: this.state.password,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then(this.isResponseOk)
			.then((response) => {
				const data = response.data;
				this.setState({
					isAuthenticated: true,
					username: '',
					password: '',
					error: '',
				});
			})
			.catch((error) => {
				console.error(error);
				this.setState({ error: 'Wrong username or password.' });
			});
	};

	//Logout Method
	logout = () => {
		// Make a POST request to the "/api/logout" URL
		axios
			.post('http://localhost:8000/api/logout/', null, {
				withCredentials: true,
			})
			.then(this.isResponseOk)
			.then((response) => {
				const data = response.data;
				console.log(data);
				this.setState({ isAuthenticated: false });
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// UI Rendering using bootstrap
	render() {
		if (!this.state.isAuthenticated) {
			return (
				<div className="container mt-3">
					<h1>React Cookie Auth</h1>
					<br />
					<h2>Login</h2>
					<form onSubmit={this.login}>
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<input
								type="text"
								className="form-control"
								id="username"
								name="username"
								value={this.state.username}
								onChange={this.handleUserNameChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="username">Password</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								value={this.state.password}
								onChange={this.handlePasswordChange}
							/>
							<div>
								{this.state.error && (
									<small className="text-danger">{this.state.error}</small>
								)}
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							Login
						</button>
					</form>
				</div>
			);
		}
		return (
			<div className="container mt-3">
				<h1>React Cookie Auth</h1>
				<p>You are logged in!</p>
				<button className="btn btn-primary mr-2" onClick={this.whoami}>
					WhoAmI
				</button>
				<button className="btn btn-danger" onClick={this.logout}>
					Log out
				</button>
			</div>
		);
	}
}

export default Login;
