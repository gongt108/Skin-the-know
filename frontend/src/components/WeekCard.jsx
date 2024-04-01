import React from 'react';

function WeekCard({ schedule }) {
	console.log(schedule);
	return (
		<div className="mx-auto flex w-[60rem]">
			<table className="mx-auto table-fixed mt-4 mb-8 w-[60rem]">
				<thead className="h-12">
					<tr>
						<th className="border px-4 py-2 w-20"></th>
						<th className="border px-4 py-2">Sunday</th>
						<th className="border px-4 py-2">Monday</th>
						<th className="border px-4 py-2">Tuesday</th>
						<th className="border px-4 py-2">Wednesday</th>
						<th className="border px-4 py-2">Thursday</th>
						<th className="border px-4 py-2">Friday</th>
						<th className="border px-4 py-2">Saturday</th>
					</tr>
				</thead>
				<tbody className="">
					{/* Render rows for AM */}
					<tr className="">
						<td className="border px-4 py-2 font-bold">AM</td>

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
									.filter((item) => item.time === 'AM')
									.map((item, index) => (
										<div key={index}>
											{item.day === day ? item.product.join(', ') : ''}
										</div>
									))}
							</td>
						))}
					</tr>
					{/* Render rows for PM */}
					<tr className="">
						<td className="border px-4 py-2 font-bold">PM</td>

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
