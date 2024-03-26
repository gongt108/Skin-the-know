import React from 'react';

function ProductwithNameCard({ product }) {
	return (
		<div className="relative group">
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
	);
}

export default ProductwithNameCard;
