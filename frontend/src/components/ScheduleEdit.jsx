import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { FaTrash, FaPlusSquare } from 'react-icons/fa';

function ScheduleEdit() {
	const { param1 } = useParams();
	const id = param1.split('-')[2];
	const [schedule, setSchedule] = useState({});
	const [myProducts, setMyProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const cookies = new Cookies();

	useEffect(() => {
		axios
			.get(
				`http://localhost:8000/api/schedule/${id}/view_or_update_schedule_details`,
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				const data = response.data;
				setSchedule(data);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
				setError(err);
				setLoading(false);
			});

		axios
			.get('http://localhost:8000/api/profile/my_products/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => {
				setMyProducts(response.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching products information:', err);
			});
	}, []);

	const removeFromSchedule = (productId) => {
		console.log(productId);

		axios
			.put(
				`http://localhost:8000/api/schedule/${id}/view_or_update_schedule_details/`,
				{
					product: productId,
					action: 'remove',
				}
			)
			.then((response) => {
				console.log('Product removed successfully:', response.data);
				setSchedule(response.data);
			})
			.catch((err) => {
				console.error('Error removing product from schedule:', err);
			});
	};

	const addToSchedule = (productId) => {
		console.log(productId);

		// axios
		// 	.put(
		// 		`http://localhost:8000/api/schedule/${id}/view_or_update_schedule_details/`,
		// 		{
		// 			product: productId,
		// 			action: 'remove',
		// 		}
		// 	)
		// 	.then((response) => {
		// 		console.log('Product removed successfully:', response.data);
		// 		setSchedule(response.data);
		// 	})
		// 	.catch((err) => {
		// 		console.error('Error removing product from schedule:', err);
		// 	});
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="w-[60rem] flex flex-col mx-auto">
			<h2 className="flex mx-auto font-semibold text-3xl my-4">
				{schedule.day} {schedule.time} Routine
			</h2>

			{/* Current schedule  */}
			<table className="border">
				<thead>
					<tr>
						<td className="border py-2 ps-4"> Product</td>
						<td className="border p-2">Main Actives</td>
						<td className="border border-r-0 p-2">
							May cause irritation if used with
						</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{schedule.products.map((product, i) => (
						<tr key={i} className="border-y">
							<td className="border py-2 ps-4 flex">
								{' '}
								<img
									className="h-10 w-10 object-contain me-2"
									src={product.img_url}
									alt="product image"
								/>{' '}
								<p className="ps-2">{product.name}</p>
							</td>
							<td className="border py-2 ps-4">
								{product.main_active
									.map((active) => {
										return active.name;
									})
									.join(', ')}
							</td>
							<td className="border border-r-0 py-2 ps-4">
								{product.main_active
									.map((active) => {
										return active.avoid_list.map((ingredient) => {
											return ingredient.name;
										});
									})
									.flat()
									.join(', ')}
							</td>
							<td>
								<div
									className="cursor-pointer me-4"
									onClick={() => removeFromSchedule(product.id)}
									title="Remove from schedule"
								>
									<FaTrash />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Owned products  */}
			<table className="border">
				<thead>
					<tr>
						<td className="border py-2 ps-4">Products I Own</td>
						<td className="border p-2">Main Actives</td>
						<td className="border border-r-0 p-2">
							May cause irritation if used with
						</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{myProducts.map((product, i) => (
						<tr key={i} className="border-y">
							<td className="border py-2 ps-4 flex">
								{' '}
								<img
									className="h-10 w-10 object-contain me-2"
									src={product.img_url}
									alt="product image"
								/>{' '}
								<p className="ps-2">{product.name}</p>
							</td>
							<td className="border py-2 ps-4">
								{product.main_active
									.map((active) => {
										return active.name;
									})
									.join(', ')}
							</td>
							<td className="border border-r-0 py-2 ps-4">
								{product.main_active
									.map((active) => {
										return active.avoid_list.map((ingredient) => {
											return ingredient.name;
										});
									})
									.flat()
									.join(', ')}
							</td>
							<td>
								<div
									className="cursor-pointer me-4"
									onClick={() => addToSchedule(product.id)}
									title="Add to current schedule"
								>
									<FaPlusSquare />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default ScheduleEdit;
