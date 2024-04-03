import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ScheduleEdit() {
	const { param1 } = useParams();
	const query = param1.split('-');
	useEffect(() => {
		console.log(query);
		axios
			.get('http://localhost:8000/api/weekly_schedule/get_schedule')
			.then((response) => {
				const data = response.data;
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
			});
	}, []);
	return <div>ScheduleEdit</div>;
}

export default ScheduleEdit;
