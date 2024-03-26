import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import ProductwithNameCard from './components/ProductwithNameCard';

function BrandPage() {
	const [brand, setBrand] = useState();
	const [products, setProducts] = useState();
	const { slug } = useParams();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/products/get_brand_products/', {
				params: {
					slug: slug,
				},
			})
			.then((response) => {
				let data = response.data;

				setProducts(data['products']);
				setBrand(data['brand_name']);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, []);

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<h1 className="my-6 font-bold flex justify-center text-3xl">
				{brand && brand}
			</h1>
			<div className="grid grid-cols-4 gap-4 mt-4">
				{products &&
					products.map((product, i) => (
						<ProductwithNameCard key={i} product={product} />
					))}
			</div>
		</div>
	);
}

export default BrandPage;
