import React from 'react';

function PackingList() {
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
