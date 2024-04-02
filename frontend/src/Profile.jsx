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
	const [schedule, setSchedule] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:8000/api/weekly_schedule/get_schedule')
			.then((response) => {
				const data = response.data;

				setWeeks(data['weeks']);
				setSchedule(data['schedule_data']);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
			});
	}, []);
	console.log(schedule);
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
			{<WeekCard schedule={schedule} />}
			<h2 className="flex mx-auto font-semibold text-xl">Breakdown</h2>
			<div className="flex flex-col">
				{[
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
				].map((day) => (
					<div className="flex flex-col mx-auto">
						<h3 className="flex mx-auto text-lg">{day}</h3>
						<div className="flex flex-col">
							<h3 className="flex mx-auto text-lg">AM</h3>

							<table className="table-fixed w-[40rem] my-2">
								<thead>
									<tr className="border">
										<td>Product</td>
										<td>Actives</td>
									</tr>
								</thead>
								{schedule
									.filter((item) => item.schedule.day === day)
									.map((item, index) => (
										<div>
											{item.schedule.time == 'AM'
												? item.products.map((product) => (
														<tr>
															<td className="flex border p-2 items-center">
																<img
																	className="h-10 w-10 object-contain me-2"
																	src={product.img_url}
																	alt="product image"
																/>
																<p>{product.name}</p>
															</td>
															<td>
																{product.main_active.map((ingredient, i) => (
																	<p>{ingredient.name}</p>
																))}
															</td>
														</tr>
												  ))
												: ''}
										</div>
									))}
							</table>
							<h3 className="flex mx-auto text-lg">PM</h3>

							<table className="table-fixed w-[40rem] my-2">
								<thead>
									<tr className="border">
										<td>Product</td>
										<td>Actives</td>
									</tr>
								</thead>
								{schedule
									.filter((item) => item.schedule.day === day)
									.map((item, index) => (
										<div>
											{item.schedule.time == 'PM'
												? item.products.map((product) => (
														<tr>
															<td className="flex border">
																<img
																	className="h-10 w-10 object-contain me-2"
																	src={product.img_url}
																	alt="product image"
																/>
																<p>{product.name}</p>
															</td>
															<td className="flex border"></td>
														</tr>
												  ))
												: ''}
										</div>
									))}
							</table>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Profile;
