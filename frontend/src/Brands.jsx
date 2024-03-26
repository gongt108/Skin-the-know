import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Brands() {
	const [ingredients, setIngredients] = useState();
	useEffect(() => {
		axios
			.get('http://localhost:8000/api/ingredients/')
			.then((response) => {
				let data = response.data;
				data.sort((a, b) => a.name.localeCompare(b.name));

				setIngredients(data);
			})
			.catch((err) => {
				console.error('Error retrieving ingredients:', err);
			});
	}, []);

	return (
		<div>
			{ingredients &&
				ingredients.map((ingredient, i) => (
					<div key={i}>
						{ingredient.name} {ingredient.id}
					</div>
				))}
		</div>
	);
}

export default Brands;
