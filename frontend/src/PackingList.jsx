import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Dropdown, DropdownItem, Modal, Button } from 'flowbite-react';

function PackingList() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const week = searchParams.get('week_id');

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/weekly_schedule/${week}/get_packing_list`)
			.then((response) => {
				const data = response.data;
				console.log(data);

				// If a schedule was found, update the state with the data
				// setWeeks(data['weeks']);
				// setWeek(data['routine_id']);
				// setSchedule(data['schedule_data']);
				// setScheduleName(data['routine_name']);
				// setScheduleId(data['routine_id']);
				setError(null);
				setIsLoading(false);
			})
			.catch((err) => {
				if (err.response.status == '401') {
					navigateTo('/login');
				} else {
					console.error('Error retrieving schedule:', err);
					setError(err);
					setIsLoading(false);
				}
			});
	}, [week]);

	return (
		<div className="w-[60rem] mx-auto">
			<table className="w-full">
				<thead>
					<tr>
						<td>Product</td>
						<td>Packed?</td>
						<td>Exclude</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="flex">
							<img src="" alt="Product image" className="me-2" />
							<p>Product Name</p>
						</td>
						<td>
							<input type="checkbox" />
						</td>
						<td>
							<input type="checkbox" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default PackingList;
