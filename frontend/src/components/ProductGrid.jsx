import React, { useState, useEffect } from 'react';
import axios from 'axios';
function ProductGrid() {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		axios
			.get('http://localhost:8000/api/allproducts')
			.then((response) => {
				console.log(response.data);
				setProducts(response.data);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, []);
	return (
		<div>
			Products
			<div className="grid grid-cols-4 gap-4">
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
							<div className="absolute bottom-0 flex flex-col bg-slate-200 w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
