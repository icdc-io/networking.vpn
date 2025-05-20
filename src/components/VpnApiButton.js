import ApiButton, { ActionTypes } from "container/ApiButton";

const VpnApiButton = ({ info }) => {
	if (!info) return null;

	const headers = [
		["x-miq-group", "%ACCOUNT.%ROLE"],
		["x-icdc-account", "%ACCOUNT"],
		["x-icdc-role", "%ROLE"],
	];
	const TOKEN = { actionType: ActionTypes.TOKEN };
	const GET = { actionType: ActionTypes.GET, headers, url: info.url };
	const CREATE = {
		actionType: ActionTypes.CREATE,
		headers,
		url: info.url,
		body: JSON.stringify(info.createInfo),
	};
	const DELETE = {
		actionType: ActionTypes.DELETE,
		headers,
		url: info.deleteUrl,
	};

	const actions = [TOKEN, GET, CREATE, DELETE];

	return <ApiButton actions={actions} />;
};

export default VpnApiButton;
