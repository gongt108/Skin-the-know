import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Logout() {
	const cookies = new Cookies();
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/logout/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => {
				setTimeout(() => {
					navigate('/');
				}, 3000);
			})
			.catch((err) => {
				console.error('Error logging out:', err);
				setTimeout(() => {
					navigate('/');
				}, 3000);
			});
	});
	return <div>You have been logged out. Redirecting to Home Page...</div>;
}

export default Logout;
