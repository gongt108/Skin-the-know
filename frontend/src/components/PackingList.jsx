import React from 'react';

function PackingList() {
	return (
		<div>
			<table>
				<thead>
					<tr>
						<td>Product</td>
						<td>Packed?</td>
						<td>Exclude</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<img src="" alt="Product image" />
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
