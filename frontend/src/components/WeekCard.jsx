import React from 'react';

function WeekCard() {
	return (
		<div className="mx-auto flex h-full flex-1 w-[60rem]">
			<table className="mx-auto table-fixed mt-8 mb-8 w-[60rem]">
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
					<tr className="">
						<td className="w-20 border px-4 py-2 font-bold">AM</td>
						<td className="border px-4 py-2">Data 1</td>
						<td className="border px-4 py-2">Data 2</td>
						<td className="border px-4 py-2">Data 3</td>
						<td className="border px-4 py-2">Data 4</td>
						<td className="border px-4 py-2">Data 5</td>
						<td className="border px-4 py-2">Data 6</td>
						<td className="border px-4 py-2">Data 7</td>
					</tr>
					<tr>
						<td className="border px-4 py-2 font-bold">PM</td>
						<td className="border px-4 py-2">Data 1</td>
						<td className="border px-4 py-2">Data 2</td>
						<td className="border px-4 py-2">Data 3</td>
						<td className="border px-4 py-2">Data 4</td>
						<td className="border px-4 py-2">Data 5</td>
						<td className="border px-4 py-2">Data 6</td>
						<td className="border px-4 py-2">Data 7</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default WeekCard;
