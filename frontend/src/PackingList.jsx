import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Dropdown, DropdownItem, Modal, Button } from 'flowbite-react';

function PackingList() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [products, setProducts] = useState();
	const [searchParams, setSearchParams] = useSearchParams();
	const [name, setName] = useState('');
	const week = searchParams.get('week_id');

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/weekly_schedule/${week}/get_packing_list`)
			.then((response) => {
				setName(response.data.name);
				setProducts(response.data.products);
				setError(null);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error retrieving packing list:', err);
				setError(err);
				setIsLoading(false);
			});
	}, [week]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-[60rem] mx-auto">
			<h1 className="flex font-semibold text-2xl text-center my-8">
				{name} Packing List
			</h1>
			<table className="w-full">
				<thead>
					<tr>
						<td>Product</td>
						<td>Packed?</td>
						<td>Exclude</td>
					</tr>
				</thead>
				<tbody>
					{products.length > 0 &&
						products.map((product) => (
							<tr key={product.id} className="even:bg-white odd:bg-gray-100">
								<td className="flex">
									<img
										src={product.img_url}
										alt="Product image"
										className="h-10 w-10 object-contain me-2"
									/>
									<p>{product.name}</p>
								</td>
								<td>
									<input type="checkbox" />
								</td>
								<td>
									<input type="checkbox" />
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default PackingList;
