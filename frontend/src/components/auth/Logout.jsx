import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
	const navigate = useNavigate();
	useEffect(() => {
		axios
			.get('http://localhost:8000/api/logout')
			.then((response) => {
				setTimeout(() => {
					navigate('/');
				}, 3000);
			})
			.catch((err) => {
				console.error('Error logging out:', err);
			});
	});
	return <div>You have been logged out. Redirecting to Home Page...</div>;
}

export default Logout;
