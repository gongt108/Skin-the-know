import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
	const [searchParams] = useSearchParams();
	const search_term = searchParams.get('term');
	console.log(search_term);

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/products/search_products/', {
				params: {
					search_term: search_term,
				},
			})
			.then((response) => {
				let data = response.data;
				console.log(data);

				// setProducts(data['products']);
				// setBrand(data['brand_name']);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, [search_term]);

	return <div>SearchResults</div>;
}

export default SearchResults;
