// frontend/src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
	return (
		<div>
			<Navbar />
			<main>
				{/* Main content (usually page-specific content) */}
				{children}
			</main>
		</div>
	);
};

export default Layout;
