import { Button } from "container/Button";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const ButtonBack = ({ back, path }) => {
	return (
		<Link to={path} relative="route">
			<Button variant="back">{back}</Button>
		</Link>
	);
};

ButtonBack.propTypes = {
	back: PropTypes.string,
	path: PropTypes.any,
};

export default ButtonBack;
