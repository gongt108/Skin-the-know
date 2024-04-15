import React, { useState, useEffect } from 'react';
import WeekCard from './components/WeekCard';
import axios from 'axios';
import Cookies from 'universal-cookie';

function ProfileEdit() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState();
	const cookies = new Cookies();
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
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching user information:', err);
			});
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="h-full flex flex-col w-[60rem] mx-auto">
			<h1 class="mt-8 mx-auto text-3xl font-bold mb-8">Profile Page</h1>

			<img
				src={user.img_url}
				alt="profile picture"
				class="w-60 h-60 object-cover rounded-full mx-auto relative z-20 cursor-pointer"
			/>
			<h1 class="mx-auto mt-2 text-xl font-semibold mb-6">
				{user.user.first_name ? user.user.first_name : user.user.username}
			</h1>
			<div class="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-4 mx-8">
				<div class="flex justify-between align-middle items-center">
					<h1 class="font-bold text-lg">Basic Information</h1>
					<a
						href="/profile/edit"
						class="bg-cyan-500 text-white  hover:bg-white hover:text-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
					>
						Edit Profile
					</a>
				</div>
				<div class="flex">
					<h3 class="w-48">First Name:</h3>
					<p>{user.user.first_name ? user.user.first_name : 'Not set yet'}</p>
				</div>
				<div class="flex">
					<h3 class="w-48">Last Name:</h3>
					<p>{user.user.last_name ? user.user.last_name : 'Not set yet'}</p>
				</div>
				<div class="flex">
					<h3 class="w-48">Email:</h3>
					{user.user.email}
				</div>
			</div>
			<div class="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-4 mx-8">
				<div class="flex justify-between align-middle items-center">
					<h1 class="font-bold text-lg">Login Information</h1>
					<a
						href="/login/edit"
						class="bg-cyan-500 text-white  hover:bg-white hover:text-cyan-500 border-2 border-cyan-500 cursor-pointer font-semibold rounded-lg px-2 py-0.5"
					>
						Change password
					</a>
				</div>
				<div class="flex">
					<h3 class="w-48">Username:</h3>
					<p> {user.user.username}</p>
				</div>
				<div class="flex">
					<h3 class="w-48">Password:</h3>
					<p>***********</p>
				</div>
			</div>
			<div class="flex flex-col space-y-2 border border-black rounded-lg p-4 mb-12 mx-8">
				<h1 class="font-bold text-lg">Saved Products</h1>

				<ul class="flex justify-between ms-4 me-8">
					<li class="underline text-cyan-500">
						<a href="/">Favorites</a>
					</li>
					<li class="underline text-cyan-500">
						<a href="/">Purchased</a>
					</li>

					<li class="underline text-cyan-500">
						<a href="/">Wishlist</a>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default ProfileEdit;
