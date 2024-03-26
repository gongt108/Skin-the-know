import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import ProductwithNameCard from './components/ProductwithNameCard';

function SearchResults() {
	const [searchParams] = useSearchParams();
	const searchTerm = searchParams.get('term');
	const [products, setProducts] = useState();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/products/search_products/', {
				params: {
					search_term: searchTerm,
				},
			})
			.then((response) => {
				let data = response.data;
				console.log(data);

				setProducts(data);
				// setBrand(data['brand_name']);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, [searchTerm]);

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<div className="ms-4 mt-4">
				Results for <span className="font-bold text-2xl">'{searchTerm}'</span>
			</div>
			<div className="grid grid-cols-5 gap-4 mt-4">
				{products &&
					products.map((product, i) => (
						<ProductwithNameCard key={i} product={product} />
					))}
			</div>
		</div>
	);
}

export default SearchResults;
