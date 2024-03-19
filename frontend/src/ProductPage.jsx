import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProductPage() {
	const [productInfo, setProductInfo] = useState();
	const { slug } = useParams();
	console.log(slug);

	useEffect(() => {
		console.log('use effect');
		axios
			.get(`http://localhost:8000/api/product/${slug}`)
			.then((response) => {
				console.log('line 13', response.data);
				setProductInfo(response.data);
			})
			.catch((err) => {
				console.error('Error retrieving product info:', err);
			});
	}, [slug]);

	console.log(productInfo);
	return (
		<div className="w-[60rem] mx-auto flex">
			{productInfo && (
				<div className="flex">
					<div className="w-1/2 h-full p-16">
						<img
							src={productInfo.img_url}
							alt="product image"
							className="w-full h-full p-4"
						/>
					</div>
					<div className="w-1/2 h-full">
						<div className="border-b">
							<h2 className="font-semibold text-2xl mt-24">
								{productInfo.name}
							</h2>
							<a href="/" className="text-lg underline text-teal-500">
								{productInfo.brand}
							</a>
							{productInfo.num_reviews === 0 ? (
								<p className="my-4">No reviews yet</p>
							) : (
								{
									/* Render reviews */
								}
							)}
						</div>
						<div>
							<h3 className="font-semibold text-xl mt-8">Ingredients</h3>
							<ul className="list-none">
								{productInfo.ingredients
									.map((ingredient, index) => ingredient.name)
									.join(', ')}
							</ul>

							<h4 className="font-semibold text-lg mt-8">
								Ingredients to avoid
							</h4>
							<ul className="list-none">
								{[
									...new Set(
										productInfo.ingredients.flatMap((ingredient) =>
											ingredient.avoid_list.map((item) => item.name)
										)
									),
								].join(', ')}
							</ul>

							<h4 className="font-semibold text-lg mt-8">Breakdown</h4>
							<table className="table-auto">
								<thead>
									<tr>
										<th className="px-4 py-2">Ingredient Name</th>
										<th className="px-4 py-2">Avoid List</th>
									</tr>
								</thead>
								<tbody>
									{productInfo.ingredients.map((ingredient, index) => (
										<tr key={index}>
											<td className="border px-4 py-2">
												<a href={ingredient.incidecoder_url}>
													{ingredient.name}
												</a>
											</td>
											<td className="border px-4 py-2">
												{ingredient.avoid_list.map((avoidItem, avoidIndex) => (
													<div key={avoidIndex}>{avoidItem.name}</div>
												))}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductPage;
