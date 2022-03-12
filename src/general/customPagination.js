import React, { useEffect, useState } from 'react';
import { Pagination } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const CustomPagination = ({ data, totalPaginationPages, activePageNumber, setActivePageNumber, searchTerm }) => {
    const [hidden, setHidden] = useState('');
    const [oldActivePage, setOldActivePage] = useState(1);
    const pageCount = Math.ceil(data.length / totalPaginationPages);

    useEffect(() => {
        setActivePageNumber(activePageNumber);
    }, [activePageNumber]);

    const changePage = (e, { activePage }) => {
        setActivePageNumber(activePage);
        setOldActivePage(activePage);
    };

    useEffect(() => {
        data.length <= totalPaginationPages ? setHidden('hidden') : setHidden('');
    }, [data]);

    useEffect(() => {
        if (activePageNumber !== oldActivePage && searchTerm === '') {
            setActivePageNumber(oldActivePage);
        } else {
            setActivePageNumber(1);
        }
    }, [searchTerm]);

    return (
        <div className={`custom-pagination ${hidden}`} >
            <Pagination
                activePage={activePageNumber}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                totalPages={pageCount}
                onPageChange={changePage}
            />
        </div>
    );
};

CustomPagination.propTypes = {
    data: PropTypes.array,
    totalPaginationPages: PropTypes.number,
    activePageNumber: PropTypes.any,
    setActivePageNumber: PropTypes.any,
    searchTerm: PropTypes.any
};

export default injectIntl(CustomPagination);
