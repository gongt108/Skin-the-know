import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ScheduleEdit() {
	const { param1 } = useParams();
	const id = param1.split('-')[2];
	const [schedule, setSchedule] = useState([]);

	useEffect(() => {
		axios
			.get(
				`http://localhost:8000/api/schedule/${id}/view_or_update_schedule_details`
			)
			.then((response) => {
				const data = response.data;
				console.log(data);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
			});
	}, []);
	return <div>ScheduleEdit</div>;
}

export default ScheduleEdit;
