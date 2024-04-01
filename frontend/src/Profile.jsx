import React, { useState, useEffect } from 'react';
import WeekCard from './components/WeekCard';
import axios from 'axios';

// const weeks = [
// 	{
// 		id: 1,
// 		sunday_am: [],
// 		sunday_pm: [],
// 		monday_am: [],
// 		monday_pm: [],
// 		tuesday_am: [],
// 		tuesday_pm: [],
// 		wednesday_am: [],
// 		wednesday_pm: [],
// 	},
// 	{
// 		id: 2,
// 		sunday_am: [],
// 		sunday_pm: [],
// 		monday_am: [],
// 		monday_pm: [],
// 		tuesday_am: [],
// 		tuesday_pm: [],
// 		wednesday_am: [],
// 		wednesday_pm: [],
// 	},
// ];

function Profile() {
	const [weeks, setWeeks] = useState();
	const [schedule, setSchedule] = useState();

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/weekly_schedule/get_schedule')
			.then((response) => {
				const data = response.data;
				console.log(data);
				setWeeks(data['weeks']);
				setSchedule(data['schedules']);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
			});
	}, []);
	return (
		<div className="h-full flex flex-col w-[60rem] mx-auto">
			<div className="mt-4 mx-auto flex space-x-2 ">
				<p className="font-semibold text-black">Week: </p>
				{weeks &&
					weeks.map((week, i) => (
						<div className="text-blue-500 cursor-pointer" key={i}>
							{i + 1}
						</div>
					))}
				<div className="button cursor-pointer">+</div>
			</div>
			<WeekCard schedule={schedule} />
		</div>
	);
}

export default Profile;
