// frontend/src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<main className="flex flex-1">
				{/* Main content (usually page-specific content) */}
				{children}
			</main>
		</div>
	);
};

export default Layout;
