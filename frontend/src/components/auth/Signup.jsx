import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
	const [newUser, setNewUser] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		isAuthenticated: false,
	});
	const [error, setError] = useState('');
	const navigateTo = useNavigate();

	const handleChange = (e) => {
		setNewUser((prevValue) => {
			return {
				...prevValue,
				[e.target.name]: e.target.value,
			};
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log('clicked');
		if (newUser.username == '' || newUser.password == '') {
			setError('Username and password fields required.');
		} else if (newUser.password !== newUser.confirmPassword) {
			setError('Passwords must match.');
		} else {
			setError('');
			console.log('createUser');

			createUser();
		}
	};

	const createUser = () => {
		const cookies = new Cookies();

		axios
			.post(
				'http://localhost:8000/api/register/',
				{
					username: newUser.username,
					password: newUser.password,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response.data);
				navigateTo('/');
			})
			.catch((error) => {
				console.error(error);
				setError('Error creating user.');
			});
	};

	return (
		<section className="bg-gray-50  flex mx-auto w-[60rem]">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Create and account
						</h1>

						<form
							className="space-y-4 md:space-y-6"
							action="#"
							onChange={(e) => handleChange(e)}
						>
							<div>
								<label
									for="username"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Username
								</label>
								<input
									type="username"
									name="username"
									id="username"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@company.com"
									required=""
								/>
							</div>
							<div>
								<label
									for="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
								/>
							</div>
							<div>
								<label
									for="confirmPassword"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Confirm password
								</label>
								<input
									type="password"
									name="confirmPassword"
									id="confirmPassword"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
								/>
							</div>
							<div className="flex items-start">
								<div className="flex items-center h-5">
									<input
										id="terms"
										aria-describedby="terms"
										type="checkbox"
										className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
										required=""
									/>
								</div>
								<div className="ml-3 text-sm">
									<label
										for="terms"
										className="font-light text-gray-500 dark:text-gray-300"
									>
										I accept the{' '}
										<a
											className="font-medium text-primary-600 hover:underline dark:text-primary-500"
											href="#"
										>
											Terms and Conditions
										</a>
									</label>
								</div>
							</div>
							{error && <div className="text-red-600">{error}</div>}

							<button
								type="submit"
								onClick={(event) => handleSubmit(event)}
								className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							>
								Create an account
							</button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Already have an account?{' '}
								<a
									href="/login"
									className="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>
									Login here
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Signup;
