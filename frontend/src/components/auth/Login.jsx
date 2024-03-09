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
				// <div className="container mt-3">
				// 	<h2>Login</h2>
				// 	<form onSubmit={this.login}>
				// 		<div className="form-group">
				// 			<label htmlFor="username">Username</label>
				// 			<input
				// 				type="text"
				// 				className="form-control"
				// 				id="username"
				// 				name="username"
				// 				value={this.state.username}
				// 				onChange={this.handleUserNameChange}
				// 			/>
				// 		</div>
				// 		<div className="form-group">
				// 			<label htmlFor="username">Password</label>
				// 			<input
				// 				type="password"
				// 				className="form-control"
				// 				id="password"
				// 				name="password"
				// 				value={this.state.password}
				// 				onChange={this.handlePasswordChange}
				// 			/>
				// 			<div>
				// 				{this.state.error && (
				// 					<small className="text-danger">{this.state.error}</small>
				// 				)}
				// 			</div>
				// 		</div>
				// 		<button type="submit" className="btn btn-primary">
				// 			Login
				// 		</button>
				// 	</form>
				// </div>
				<section class="bg-gray-50 dark:bg-gray-900">
					<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
						<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
							<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
								<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
									Sign in to your account
								</h1>
								<form class="space-y-4 md:space-y-6" onSubmit={this.login}>
									<div>
										<label
											for="username"
											class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Username
										</label>
										<input
											type="text"
											name="username"
											id="username"
											value={this.state.username}
											onChange={this.handleUserNameChange}
											class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="name@company.com"
											required=""
										/>
									</div>
									<div>
										<label
											for="password"
											class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
										>
											Password
										</label>
										<input
											type="password"
											name="password"
											id="password"
											value={this.state.password}
											onChange={this.handlePasswordChange}
											placeholder="••••••••"
											class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											required=""
										/>
									</div>
									<div>
										{this.state.error && (
											<small className="text-danger">{this.state.error}</small>
										)}
									</div>

									<button
										type="submit"
										class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
									>
										Sign in
									</button>
									<p class="text-sm font-light text-gray-500 dark:text-gray-400">
										Don’t have an account yet?{' '}
										<a
											href="#"
											class="font-medium text-primary-600 hover:underline dark:text-primary-500"
										>
											Sign up
										</a>
									</p>
								</form>
							</div>
						</div>
					</div>
				</section>
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
