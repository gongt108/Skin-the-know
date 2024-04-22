import React, { useState, useEffect } from 'react';
import WeekCard from './components/WeekCard';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

function Profile() {
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState();
	const [newUserInfo, setNewUserInfo] = useState({
		firstName: '',
		lastName: '',
		email: '',
	});
	const cookies = new Cookies();
	const navigateTo = useNavigate();
	const token = cookies.get('csrftoken');

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/profile/account_details/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => {
				setUser(response.data);
				setNewUserInfo({
					firstName: response.data.user.first_name || '',
					lastName: response.data.user.last_name || '',
					email: response.data.user.email || '',
				});
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching user information:', err);
				if (err.response.status == '401') {
					navigateTo('/login');
				}
			});
	}, []);

	const handleFormChange = (e) => {
		setNewUserInfo((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const saveProfile = (e) => {
		e.preventDefault();
		console.log(newUserInfo);
		axios
			.put(
				`http://localhost:8000/api/profile/update_account/`,
				{
					first_name: newUserInfo.firstName,
					last_name: newUserInfo.lastName,
					email: newUserInfo.email,
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
				setUser(response.data);
				setIsEditing(false);
			})
			.catch((err) => console.error('error updating profile:', err));
		// setNewUserInfo({
		// 	firstName: '',
		// 	lastName: '',
		// 	email: '',
		// });
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="h-full flex flex-col w-[60rem] mx-auto">
			<h1 className="mt-8 mx-auto text-3xl font-bold mb-8">Profile Page</h1>

			<img
				src={user.img_url}
				alt="profile picture"
				className="w-60 h-60 object-cover rounded-full mx-auto relative z-20 cursor-pointer"
			/>
			<h1 className="mx-auto mt-2 text-xl font-semibold mb-6">
				{user.user.first_name ? user.user.first_name : user.user.username}
			</h1>
			{!isEditing && (
				<div className="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-4 mx-8">
					<div className="flex justify-between align-middle items-center">
						<h1 className="font-bold text-lg">Basic Information</h1>
						<div
							className="bg-cyan-500 text-white  hover:bg-white hover:text-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</div>
					</div>
					<div className="flex">
						<h3 className="w-48">First Name:</h3>
						<p>{user.user.first_name ? user.user.first_name : 'Not set yet'}</p>
					</div>
					<div className="flex">
						<h3 className="w-48">Last Name:</h3>
						<p>{user.user.last_name ? user.user.last_name : 'Not set yet'}</p>
					</div>
					<div className="flex">
						<h3 className="w-48">Email:</h3>
						{user.user.email}
					</div>
				</div>
			)}
			{isEditing && (
				<div className="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-4 mx-8">
					<form onSubmit={saveProfile} onChange={handleFormChange}>
						<div className="flex justify-between align-middle items-center">
							<h1 className="font-bold text-lg">Edit Basic Information</h1>
							<div className="flex space-x-2">
								<div
									className="text-cyan-500 bg-white  hover:text-white hover:bg-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</div>
								<button
									type="submit"
									className="bg-cyan-500 text-white  hover:bg-white hover:text-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
								>
									Save Profile
								</button>
							</div>
						</div>
						<div className="flex my-2 items-center">
							<label htmlFor="firstName" className="w-48">
								First Name:
							</label>
							<input
								type="text"
								name="firstName"
								value={newUserInfo.firstName}
								className="border p-1"
							/>
						</div>
						<div className="flex items-center">
							<label htmlFor="lastName" className="w-48">
								Last Name:
							</label>
							<input
								type="text"
								name="lastName"
								value={newUserInfo.lastName}
								className="border p-1"
							/>
						</div>
						<div className="flex my-2 items-center">
							<label htmlFor="email" className="w-48">
								Email:
							</label>
							<input
								type="email"
								className="border p-1"
								value={newUserInfo.email}
							/>
						</div>
					</form>
				</div>
			)}
			<div className="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-4 mx-8">
				<div className="flex justify-between align-middle items-center">
					<h1 className="font-bold text-lg">Login Information</h1>
					<a
						href="/login/edit"
						className="bg-cyan-500 text-white  hover:bg-white hover:text-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
					>
						Change password
					</a>
				</div>
				<div className="flex">
					<h3 className="w-48">Username:</h3>
					<p> {user.user.username}</p>
				</div>
				<div className="flex">
					<h3 className="w-48">Password:</h3>
					<p>***********</p>
				</div>
			</div>
			<div className="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-12 mx-8">
				<h1 className="font-bold text-lg">Saved Products</h1>

				<ul className="flex justify-between ms-4 me-8">
					<li className="underline text-cyan-500">
						<a href="/mylists/favorites">Favorites</a>
					</li>
					<li className="underline text-cyan-500">
						<a href="/mylists/purchased">Purchased</a>
					</li>

					<li className="underline text-cyan-500">
						<a href="/mylists/wishlist">Wishlist</a>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Profile;
