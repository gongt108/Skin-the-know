// frontend/src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
	return (
		<div>
			<header>
				{/* Header content goes here */}
				<h1>My App</h1>
			</header>
			<Navbar />
			<main>
				{/* Main content (usually page-specific content) */}
				{children}
			</main>
			<footer>
				{/* Footer content goes here */}
				<p>&copy; 2024 My App</p>
			</footer>
		</div>
	);
};

export default Layout;
