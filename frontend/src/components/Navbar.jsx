import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

const customTheme = {
	button: {
		color: {
			primary: 'bg-red-500 hover:bg-red-600',
		},
	},
};

function Navbar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const cookies = new Cookies();
	const { pathname: pathNow } = useLocation();

	useEffect(() => {
		console.log('hello');
		axios
			.get('http://localhost:8000/api/session/', {
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': cookies.get('csrftoken'),
				},
				withCredentials: true,
			})
			.then((response) => {
				console.log(response.data);
				setIsLoggedIn(response.data.isauthenticated);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [pathNow]);

	const [isSearching, setIsSearching] = useState(false);
	const [searchTerm, setSeachTerm] = useState('');
	const navigateTo = useNavigate();

	const toggleSearch = () => {
		setIsSearching(!isSearching);
	};

	const updateSearchTerm = (e) => {
		e.preventDefault();
		setSeachTerm(e.target.value);
	};

	const submitSearch = (e) => {
		e.preventDefault();
		navigateTo(`/search?term=${searchTerm}`);
	};

	return (
		<div className="flex flex-col">
			<nav className="flex bg-white border-gray-200 dark:bg-gray-900">
				<div className="w-[60rem] flex flex-wrap items-center justify-between mx-auto p-4">
					<a
						href="/"
						className="flex items-center space-x-3 rtl:space-x-reverse"
					>
						<img
							src="https://flowbite.com/docs/images/logo.svg"
							className="h-8"
							alt="Flowbite Logo"
						/>
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							Skin the Know
						</span>
					</a>
					<div className="flex md:order-2">
						<button
							type="button"
							data-collapse-toggle="navbar-search"
							aria-controls="navbar-search"
							aria-expanded="false"
							className=" text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
							onClick={toggleSearch}
						>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
							<span className="sr-only">Search</span>
						</button>
						<button
							data-collapse-toggle="navbar-search"
							type="button"
							className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
							aria-controls="navbar-search"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 17 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 1h15M1 7h15M1 13h15"
								/>
							</svg>
						</button>
					</div>
					<div
						className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
						id="navbar-search"
					>
						<ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
							<li>
								<a
									href="/"
									className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
									aria-current="page"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="/"
									className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
								>
									Products
								</a>
							</li>

							<li>
								<a
									href="/brands"
									className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
								>
									Brands
								</a>
							</li>

							<li>
								<Dropdown
									inline
									theme={{ theme: customTheme }}
									className="text-white white z-20"
									dismissOnClick={false}
									renderTrigger={() => (
										<span className="text-white cursor-pointer hover:text-blue-500">
											Skin Concerns
										</span>
									)}
								>
									<DropdownItem
										as="a"
										href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Acne
									</DropdownItem>
									<DropdownItem
										as="a"
										href="/category?query=hyperpigmentation"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Hyperpigmentation
									</DropdownItem>
									<DropdownItem
										as="a"
										href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Hydration
									</DropdownItem>
									<DropdownItem
										as="a"
										href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Oil Control
									</DropdownItem>
									<DropdownItem
										as="a"
										href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Pores
									</DropdownItem>
									<DropdownItem
										as="a"
										href="/"
										style={{ color: 'inherit', textDecoration: 'none' }}
										onMouseEnter={(e) => (e.target.style.color = '#112554')}
										onMouseLeave={(e) => (e.target.style.color = 'inherit')}
									>
										Anti-aging
									</DropdownItem>
								</Dropdown>
							</li>
							{!isLoggedIn && (
								<li>
									<a
										href="/login"
										className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
									>
										Login
									</a>
								</li>
							)}
							{isLoggedIn && (
								<li className="hover:text-blue-500">
									<Dropdown
										inline
										className="text-white white z-20"
										dismissOnClick={false}
										renderTrigger={() => (
											<span className="text-white cursor-pointer hover:text-blue-500">
												Profile
											</span>
										)}
									>
										<DropdownItem
											as="a"
											href="/profile"
											style={{ color: 'inherit', textDecoration: 'none' }}
											onMouseEnter={(e) => (e.target.style.color = '#112554')}
											onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										>
											Go to Profile
										</DropdownItem>
										<DropdownItem
											as="a"
											href="/"
											style={{ color: 'inherit', textDecoration: 'none' }}
											onMouseEnter={(e) => (e.target.style.color = '#112554')}
											onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										>
											Routine
										</DropdownItem>
										<DropdownItem
											as="a"
											href="/logout"
											style={{ color: 'inherit', textDecoration: 'none' }}
											onMouseEnter={(e) => (e.target.style.color = '#112554')}
											onMouseLeave={(e) => (e.target.style.color = 'inherit')}
										>
											Logout
										</DropdownItem>
									</Dropdown>
								</li>
							)}
						</ul>
					</div>
				</div>
			</nav>
			<div
				className={`max-w-[60rem] w-full items-center justify-between mx-auto ${
					isSearching ? 'flex' : 'hidden'
				} `}
			>
				<form className=" w-full" onSubmit={(e) => submitSearch(e)}>
					<input
						type="text"
						id="search-navbar"
						className=" w-full block py-4 p-2 ps-10 text-sm text-gray-900 bg-gray-300/50  focus:outline-none"
						placeholder="Search..."
						onChange={(e) => updateSearchTerm(e)}
					/>
				</form>
			</div>
		</div>
	);
}

export default Navbar;
