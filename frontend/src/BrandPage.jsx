import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
						<div className="relative group" key={i}>
							<a href={`/product/${product.unique_identifier}`}>
								<img
									src={product.img_url}
									className="w-60 h-60 rounded-lg object-contain"
									alt="product image"
								/>
							</a>
							<div className="flex flex-col bg-slate-200 w-full p-2">
								<h2 className="truncate">{product.name}</h2>
							</div>
							{/* Add more product details here */}
						</div>
					))}
			</div>
		</div>
	);
}

export default BrandPage;
