import PropTypes from "prop-types";

const searchMethod = (data, searchTerm, fields, searchingFromStartFields) => {
	if (!data || !data.length) return [];

	if (!searchTerm) return data;

	return data.filter((value) => {
		if (searchTerm === "") {
			return true;
		}

		return fields.some((field) =>
			!value[field]
				? false
				: value[field]
						.toString()
						.toLowerCase()
						[
							searchingFromStartFields.includes(field)
								? "startsWith"
								: "includes"
						](searchTerm.toLowerCase()),
		);
	});
};

searchMethod.propTypes = {
	data: PropTypes.any,
	searchTerm: PropTypes.any,
	fields: PropTypes.any,
	searchingFromStartFields: PropTypes.any,
};

export default searchMethod;
