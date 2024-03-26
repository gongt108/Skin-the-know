import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BrandPage() {
	const [products, setProducts] = useState();
	const { slug } = useParams();
	console.log(slug);

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/products/get_brand_products/', {
				params: {
					slug: slug,
				},
			})
			.then((response) => {
				let data = response.data;
				// let brandList = {};
				// data.sort((a, b) => a.name.localeCompare(b.name));
				// data.map((brand) => {
				// 	let letter = brand['name'][0].toUpperCase();
				// 	if (brandList[letter]) {
				// 		brandList[letter].push(brand);
				// 	} else {
				// 		brandList[letter] = [brand];
				// 	}
				// });
				setProducts(data);
			})
			.catch((err) => {
				console.error('Error retrieving products:', err);
			});
	}, []);

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<div className="grid grid-cols-5 gap-4">
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

export default BrandPage;
