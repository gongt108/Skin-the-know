import React from 'react';
import { useParams } from 'react-router-dom';

function ListPage() {
	const { listName } = useParams();

	return <div>{listName}</div>;
}

export default ListPage;
