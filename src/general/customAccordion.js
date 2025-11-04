import { Button } from "container/Button";
import { Label } from "container/Label";
import { Download } from "lucide-react";
import { PropTypes } from "prop-types";
import React from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const CodeSnippet = React.lazy(() => import("container/CodeSnippet"));

export const CustomAccordion = ({ configData, index, open, handleClick }) => {
	const { t } = useTranslation();
	const connectionName = useSelector(
		(state) => state.VpnStore.vpnClientConnection.name,
	);
	const user = useSelector((state) => state.host.user);

	const file = new Blob([configData.config], { type: "text/plain" });
	const link = URL.createObjectURL(file);

	const fileName = `${user.account}-${user.location}-${connectionName}`.slice(
		0,
		15,
	);

	return (
		<div className="accordion">
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static element interactions are allowed */}
			<section
				style={
					open
						? { borderRadius: "5px 5px 0px 0px", borderColor: "#2185D0" }
						: {}
				}
				className="title-config"
				onClick={() => {
					open ? handleClick("close") : handleClick(index);
				}}
			>
				<span>{t(configData.title)}</span>
				<span>{open ? t("hide") : t("show")}</span>
			</section>
			{open && (
				<section className="description-config">
					<Label>{t("instruction")}</Label>
					{configData.title === "qrCodeTitle" ? (
						<div className="qr-wrapper">
							{configData.descriptions.map((el, i) =>
								i === 0 ? (
									<div className="inctruction-item" key={el.text}>
										{<DangerousHTML html={t(el.text)} />}
									</div>
								) : (
									<div className="inctruction-item" key={el.text}>
										{t(el.text)}
									</div>
								),
							)}
							<img
								src={`data:image/png;base64, ${configData.urlQR}`}
								alt="img"
							/>
						</div>
					) : (
						<div className="os-wrapper">
							<div className="inctruction-item">
								{
									<DangerousHTML
										html={t(configData.descriptions[0].text, {
											fileName: fileName,
										})}
									/>
								}
							</div>
							{configData.title === "windowsTitle" && (
								<span>
									{
										<DangerousHTML
											html={t(configData.descriptions[1].text, {
												fileName: fileName,
											})}
										/>
									}
								</span>
							)}
							<div className="api-dialog-snippet-wrapper">
								<CodeSnippet
									title={t("configFile")}
									content={configData.config}
									noFormatting={true}
								/>
							</div>
							{
								<div className="inctruction-item">
									{t(
										configData.descriptions[
											configData.title === "windowsTitle" ? 2 : 1
										].text,
									)}
								</div>
							}
							{configData.title === "linuxTitle" && (
								<div className="command">
									<code>{`sudo nmcli conn import type wireguard file ${fileName}.conf`}</code>
								</div>
							)}
							<div className="inctruction-item">
								{t(
									configData.descriptions[
										configData.title === "windowsTitle" ? 3 : 2
									].text,
								)}
							</div>
							{configData.title === "linuxTitle" && (
								<div className="command">
									<code>{`nmcli conn show ${fileName}`}</code>
								</div>
							)}
							<div style={{ position: "relative" }}>
								<div style={{ width: "144px" }}>
									<a href={link} download={`${fileName}.conf`}>
										<div className="link-div" />
									</a>
								</div>
								<Button
									variant="secondary"
									style={
										configData.title !== "windowsTitle"
											? { marginTop: "15px" }
											: {}
									}
								>
									{t("download")}&nbsp;
									<Download size={16} />
								</Button>
							</div>
						</div>
					)}
				</section>
			)}
		</div>
	);
};

CustomAccordion.propTypes = {
	configData: PropTypes.object,
	index: PropTypes.string,
	open: PropTypes.bool,
	handleClick: PropTypes.func,
};
