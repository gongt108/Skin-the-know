import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { FaTrash } from 'react-icons/fa';

function ScheduleEdit() {
	const { param1 } = useParams();
	const id = param1.split('-')[2];
	const [schedule, setSchedule] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		axios
			.get(
				`http://localhost:8000/api/schedule/${id}/view_or_update_schedule_details`
			)
			.then((response) => {
				const data = response.data;
				setSchedule(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
				setError(err);
				setLoading(false);
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
								>
									<FaTrash />
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
