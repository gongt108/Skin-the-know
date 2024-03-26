import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BrandPage() {
	const [brands, setProducts] = useState();
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
				let brandList = {};
				data.sort((a, b) => a.name.localeCompare(b.name));
				data.map((brand) => {
					let letter = brand['name'][0].toUpperCase();
					if (brandList[letter]) {
						brandList[letter].push(brand);
					} else {
						brandList[letter] = [brand];
					}
				});
				setProducts(brandList);
			})
			.catch((err) => {
				console.error('Error retrieving brands:', err);
			});
	}, []);

	return (
		<div className="w-[60rem] mx-auto flex mt-4 flex-col">
			<ul className="flex mx-auto space-x-2 mt-2">
				{brands &&
					Object.keys(brands).map((brandLetter, i) => (
						<li key={i} className="mr-1 flex items-center ">
							<a
								href={`#${brandLetter}`}
								className="hover:underline text-lg text-blue-500"
							>
								{brandLetter}
							</a>
							{i < Object.keys(brands).length - 1 && (
								<span className="ml-2 text-gray-300">|</span>
							)}
						</li>
					))}
			</ul>

			{brands && (
				<div className="w-full mt-4">
					{Object.entries(brands).map(([key, value], index) => (
						<div
							className="grid gap-4 grid-cols-5 border-b border-gray-300 py-2 "
							id={key}
							key={index}
						>
							<div className="text-xl col-span-1 justify-center flex align-middle items-center">
								{key}
							</div>
							<div className="col-span-4 grid grid-cols-4 mb-2">
								{value.map((brand, i) => (
									<div key={i} className="col-span-1 mt-2">
										<a
											href={`/brand/${brand.slug}`}
											className="text-blue-500 hover:underline"
										>
											{brand.name}
										</a>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default BrandPage;
