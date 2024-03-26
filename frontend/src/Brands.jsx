import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Brands() {
	const [brands, setBrands] = useState();
	useEffect(() => {
		axios
			.get('http://localhost:8000/api/brands/')
			.then((response) => {
				let data = response.data;
				let brandList = {};
				data.sort((a, b) => a.name.localeCompare(b.name));
				data.map((brand) => {
					let letter = brand['name'][0];
					if (brandList[letter]) {
						brandList[letter].push(brand);
					} else {
						brandList[letter] = [brand];
					}
				});
				setBrands(brandList);
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
						<li key={i} className="mr-1 flex items-center">
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
						<div className="grid gap-4 grid-cols-5" id={key} key={index}>
							<div className="text-xl col-span-1 text-center">{key}</div>
							<div className="col-span-4 grid grid-cols-4">
								{value.map((brand, i) => (
									<div key={i} className=" col-span-1">
										<a href="" className="text-blue-500 hover:underline">
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

export default Brands;
