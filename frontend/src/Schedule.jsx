import React, { useState, useEffect } from 'react';
import WeekCard from './components/WeekCard';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlusSquare } from 'react-icons/fa';
import { Dropdown, DropdownItem } from 'flowbite-react';

function Schedule() {
	const [currentView, setCurrentView] = useState('week');
	const [weeks, setWeeks] = useState();
	const [week, setWeek] = useState(0);
	const [schedule, setSchedule] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const cookies = new Cookies();
	const navigateTo = useNavigate();

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/weekly_schedule/get_schedule`, {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				params: {
					week: week,
				},
				withCredentials: true,
			})
			.then((response) => {
				const data = response.data;
				console.log(data);
				setWeeks(data['weeks']);
				setSchedule(data['schedule_data']);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error retrieving schedule:', err);
			});
	}, [week]);

	const weekSelection = (i) => {
		navigateTo(`/schedule?week=${i + 1}`);
		setWeek(i);
	};

	const addRoutine = () => {
		axios
			.put('http://localhost:8000/api/weekly_schedule/add_routine/', null, {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => console.log(response.data))
			.catch((err) => console.error('error creating routine:', err));
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="h-full flex flex-col w-[60rem] mx-auto">
			<h2 className="flex mx-auto font-semibold text-xl mt-4">
				{schedule[0].routine_name}
			</h2>
			<div className="flex">
				<div className={`w-5/6 ${currentView == 'week' ? '' : 'hidden'}`}>
					{<WeekCard schedule={schedule} />}
				</div>
				<div className={`w-5/6 ${currentView == 'daily' ? '' : 'hidden'}`}>
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
						].map((day) => {
							// Filter schedule for the current day
							const daySchedule = schedule.filter(
								(item) => item.schedule.day === day
							);
							// Separate AM and PM schedules
							const amSchedule = daySchedule.filter(
								(item) => item.schedule.time === 'AM'
							);
							const pmSchedule = daySchedule.filter(
								(item) => item.schedule.time === 'PM'
							);
							return (
								<div className="flex flex-col mx-auto" key={day}>
									<h3 className="flex mx-auto text-lg">{day}</h3>
									<div className="flex flex-col">
										{/* Render AM schedule */}
										{amSchedule.map((item, index) => (
											<React.Fragment key={index}>
												<div className="flex justify-between px-2">
													<h3 className="flex text-lg font-semibold">AM</h3>
													<a
														href={`/schedule/${item.schedule.day}-${item.schedule.time}-${item.schedule.id}`}
														className="text-sm"
													>
														Revise
													</a>
												</div>
												<table className="table-fixed w-full mb-4">
													<thead>
														<tr className="border">
															<td className="w-1/2 py-1 px-2">Product</td>
															<td className="w-1/2 py-1 px-2">Actives</td>
														</tr>
													</thead>
													<tbody>
														{item.products.map((product, productIndex) => (
															<tr key={productIndex} className="border">
																<td className="w-1/2 p-2 border">
																	<div className="flex items-center">
																		<img
																			className="h-10 w-10 object-contain me-2"
																			src={product.img_url}
																			alt="product image"
																		/>
																		<p>{product.name}</p>
																	</div>
																</td>
																<td className="w-1/2 p-2">
																	{product.main_active
																		.map((ingredient, i) => ingredient.name)
																		.join(', ')}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</React.Fragment>
										))}
										{/* Render PM schedule */}
										{pmSchedule.map((item, index) => (
											<React.Fragment key={index}>
												<div className="flex justify-between px-2">
													<h3 className="flex text-lg font-semibold">PM</h3>
													<a
														href={`/edit-schedule-${item.schedule.id}`}
														className="text-sm"
													>
														Revise
													</a>
												</div>
												<table className="table-fixed w-full mb-4">
													<thead>
														<tr className="border">
															<td className="w-1/2 py-1 px-2">Product</td>
															<td className="w-1/2 py-1 px-2">Actives</td>
														</tr>
													</thead>
													<tbody>
														{item.products.map((product, productIndex) => (
															<tr key={productIndex} className="border">
																<td className="w-1/2 p-2 border">
																	<div className="flex items-center">
																		<img
																			className="h-10 w-10 object-contain me-2"
																			src={product.img_url}
																			alt="product image"
																		/>
																		<p>{product.name}</p>
																	</div>
																</td>
																<td className="w-1/2 p-2">
																	{product.main_active
																		.map((ingredient, i) => ingredient.name)
																		.join(', ')}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</React.Fragment>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="mt-4 flex flex-col items-center w-1/6 px-2 space-y-2">
					<div className="w-full">
						<Dropdown
							// inline
							className="border rounded-md"
							dismissOnClick={false}
							renderTrigger={() => (
								<div className="w-full border rounded-md p-2 cursor-pointer hover:bg-blue-300">
									Change Week
								</div>
							)}
						>
							{weeks &&
								weeks.map((week, i) => (
									<div
										className="text-blue-500 cursor-pointer"
										key={i}
										onClick={() => weekSelection(i)}
									>
										<DropdownItem
											style={{ color: 'inherit', textDecoration: 'none' }}
											onMouseEnter={(e) => (e.target.style.color = '#112554')}
											onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										>
											{week.name}
										</DropdownItem>
									</div>
								))}
						</Dropdown>
					</div>
					<div
						className={`w-full border rounded-md p-2 cursor-pointer ${
							currentView == 'week'
								? 'bg-blue-950 text-white font-semibold'
								: 'bg-white hover:bg-blue-300'
						}`}
						onClick={() => setCurrentView('week')}
					>
						Week View
					</div>
					<div
						className={`w-full border rounded-md p-2 cursor-pointer  ${
							currentView == 'daily'
								? 'bg-blue-950 text-white font-semibold'
								: 'bg-white hover:bg-blue-300'
						}`}
						onClick={() => setCurrentView('daily')}
					>
						Daily Breakdown
					</div>
					<div
						className="w-full border rounded-md p-2 cursor-pointer hover:bg-blue-300"
						onClick={addRoutine}
					>
						New Routine
					</div>
					<div className="w-full border rounded-md p-2 cursor-pointer hover:bg-blue-300">
						Rename Routine
					</div>
					<div className="w-full border rounded-md p-2 cursor-pointer hover:bg-blue-300">
						Delete Routine
					</div>
				</div>
			</div>
		</div>
	);
}

export default Schedule;
