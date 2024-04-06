import React, { useState, useEffect } from 'react';
import WeekCard from './components/WeekCard';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Profile() {
	const cookies = new Cookies();
	const token = cookies.get('csrftoken');
	console.log(token);

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
				console.log(response.data);
			})
			.catch((err) => {
				console.error('Error fetching user information:', err);
			});
	});

	return <div className="h-full flex flex-col w-[60rem] mx-auto">Profile</div>;
}

export default Profile;
