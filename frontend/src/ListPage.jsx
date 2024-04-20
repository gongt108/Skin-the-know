import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

function ListPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { listName } = useParams();
	const cookies = new Cookies();

	useEffect(() => {
		axios
			.get(
				'http://localhost:8000/api/profile/get_list_products/',

				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					params: {
						list_name: listName,
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response.data);
				setError(null);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching list information:', err);
				setIsLoading(false);
				setError(err.response);
			});
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error && error.status == '404') {
		return <div>{error.data}</div>;
	}

	return <div>{listName}</div>;
}

export default ListPage;
