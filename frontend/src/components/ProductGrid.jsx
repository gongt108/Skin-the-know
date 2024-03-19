import React, { useState, useEffect } from 'react';
import axios from 'axios';
function ProductGrid() {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		axios
			.get('http://localhost:8000/api/allproducts')
			.then((response) => {
				setProducts(response.data);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, []);
	return (
		<div className="mx-auto w-[60rem]">
			<div className="grid grid-cols-5 gap-4">
				<div className="bg-gray-300 py-4 text-2xl font-semibold row-span-2 flex items-center justify-center text-center">
					Top Rated Products
				</div>

				{products &&
					products.map((product) => (
						<div className="relative group" key={product.pk}>
							<a href="/">
								<img
									src={product.img_url}
									className="w-60 h-60 rounded-lg object-contain"
									alt="product image"
								/>
							</a>
							<div className="absolute bottom-0 flex flex-col bg-slate-200 w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
								<h2 className="truncate">{product.name}</h2>
							</div>
							{/* Add more product details here */}
						</div>
					))}
			</div>
		</div>
	);
}

export default ProductGrid;
