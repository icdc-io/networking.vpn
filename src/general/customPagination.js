import Paginator from "container/Paginator";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const CustomPagination = ({
	data,
	totalPaginationPages,
	activePageNumber,
	setActivePageNumber,
	searchTerm,
}) => {
	const [hidden, setHidden] = useState("");
	const [oldActivePage, setOldActivePage] = useState(1);
	const pageCount = Math.ceil(data.length / totalPaginationPages);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setActivePageNumber(activePageNumber);
	}, [activePageNumber]);

	const changePage = (activePage) => {
		setActivePageNumber(activePage);
		setOldActivePage(activePage);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		data.length <= totalPaginationPages ? setHidden("hidden") : setHidden("");
	}, [data]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (activePageNumber !== oldActivePage && searchTerm === "") {
			setActivePageNumber(oldActivePage);
		} else {
			setActivePageNumber(1);
		}
	}, [searchTerm]);

	return (
		<div className={`custom-pagination ${hidden}`}>
			<Paginator
				currentPage={activePageNumber}
				onPageChange={changePage}
				totalPages={pageCount}
			/>
		</div>
	);
};

CustomPagination.propTypes = {
	data: PropTypes.array,
	totalPaginationPages: PropTypes.number,
	activePageNumber: PropTypes.any,
	setActivePageNumber: PropTypes.any,
	searchTerm: PropTypes.any,
};

export default CustomPagination;
