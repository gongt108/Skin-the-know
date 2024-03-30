import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import ProductwithNameCard from './components/ProductwithNameCard';

function CategoryPage() {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('query');
	const [products, setProducts] = useState();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/skinconcern/get_products/', {
				params: {
					query: query,
				},
			})
			.then((response) => {
				let data = response.data;

				setProducts(data);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, [query]);

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<div className="ms-4 mt-4">
				Results for <span className="font-bold text-2xl">'{query}'</span>
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

export default CategoryPage;
