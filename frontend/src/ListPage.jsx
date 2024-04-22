import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';

function ListPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [products, setProducts] = useState([]);
	const { listName } = useParams();
	const cookies = new Cookies();

	useEffect(() => {
		axios
			.get(
				'http://localhost:8000/api/profile/get_list_products/',

				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					params: {
						list_name: listName,
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				setProducts(response.data);
				setError(null);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching list information:', err);
				setIsLoading(false);
				setError(err.response);
			});
	}, [products]);

	const addToList = (list, productId) => {
		axios
			.put(
				'http://localhost:8000/api/profile/add_to_list/',
				{
					list: list,
					product_pk: productId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				notify(response.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const deleteFromList = (productId) => {
		axios
			.put(
				'http://localhost:8000/api/profile/delete_from_list/',
				{
					list: listName,
					product_pk: productId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': cookies.get('csrftoken'),
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				setProducts(response.data);
				notify(`Successfully removed from ${listName}`);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const notify = (message) => {
		toast(message, {
			position: 'top-right',
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error && error.status == '404') {
		return <div>{error.data}</div>;
	}

	return (
		<div className="w-[60rem] flex flex-col mx-auto">
			<ToastContainer />

			<div className="text-center my-8 font-semibold text-2xl">
				MY {listName.toUpperCase()}
			</div>
			{!products.length && <p>No products saved in {listName} yet.</p>}
			{products.length > 0 && (
				<table className="mx-8">
					{products.map((product) => (
						<tr className="flex p-2 items-center justify-between bg-gray-50 even:bg-white odd:bg-gray-100">
							<div className="flex items-center">
								<img
									src={product.img_url}
									alt="product image"
									className="h-10 w-10 object-contain me-2"
								/>
								<a
									href={`/product/${product.unique_identifier}`}
									className="hover:text-blue-300"
								>
									{product.name}
								</a>
							</div>
							<div className="flex me-8 items-center">
								<Dropdown
									inline
									dismissOnClick={false}
									className="w-[20rem] bg-white"
									renderTrigger={() => (
										<div className="flex items-center border rounded-md px-2 py-1 me-4 cursor-pointer">
											Add to List
											<IoMdArrowDropdown size={20} className="ms-2" />
										</div>
									)}
								>
									<DropdownItem
										// as="a"
										// href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										onClick={() => addToList('favorites', product.id)}
										className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
									>
										Favorites{' '}
									</DropdownItem>
									<DropdownItem
										// as="a"
										// href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										onClick={() => addToList('purchased', product.id)}
										className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
									>
										Purchased
									</DropdownItem>
									<DropdownItem
										// as="a"
										// href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										onClick={() => addToList('wishlist', product.id)}
										className="font-semibold text-center rounded-md p-2 cursor-pointer hover:text-blue-950"
									>
										Wishlist
									</DropdownItem>
								</Dropdown>
								<FaRegTrashAlt
									size={20}
									className="cursor-pointer hover:text-red-500"
									onClick={() => deleteFromList(product.id)}
								/>
							</div>
						</tr>
					))}
				</table>
			)}
		</div>
	);
}

export default ListPage;
