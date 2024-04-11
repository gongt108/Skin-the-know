import React from 'react';

function WeekCard({ schedule }) {
	return (
		<div className="mx-auto flex w-full">
			<table className="mx-auto table-fixed mt-4 mb-8 w-full">
				<thead className="h-12">
					<tr>
						<th className="border py-2 w-12"></th>
						<th className="border px-auto py-2">Sunday</th>
						<th className="border px-auto py-2">Monday</th>
						<th className="border px-auto py-2">Tuesday</th>
						<th className="border px-auto py-2">Wednesday</th>
						<th className="border px-auto py-2">Thursday</th>
						<th className="border px-auto py-2">Friday</th>
						<th className="border px-auto py-2">Saturday</th>
					</tr>
				</thead>
				<tbody className="">
					{/* Render rows for AM */}
					<tr className="">
						<td className="border text-center py-2 font-bold">AM</td>

						{[
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday',
						].map((day) => (
							<td key={day} className="border px-4 py-2">
								{/* Render product data based on day */}
								{schedule
									.filter((item) => item.schedule.time === 'AM')
									.map((item, index) => (
										<div key={index} className="grid grid-cols-2 gap-2 my-2">
											{item.schedule.day === day
												? item.products.map((product) => (
														<div key={product.id}>
															<img
																src={product.img_url}
																alt="image"
																className="h-10 w-10 object-contain"
															/>
														</div>
												  ))
												: ''}
										</div>
									))}
							</td>
						))}
					</tr>
					{/* Render rows for PM */}
					<tr className="">
						<td className="border text-center font-bold">PM</td>

						{[
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday',
						].map((day) => (
							<td key={day} className="border px-4 py-2">
								{/* Render product data based on day */}
								{schedule
									.filter((item) => item.time === 'PM')
									.map((item, index) => (
										<div key={index}>
											{item.day === day ? item.product.join(', ') : ''}
										</div>
									))}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default WeekCard;
