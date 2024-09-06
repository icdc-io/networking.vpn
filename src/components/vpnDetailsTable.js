import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader, Popup, Table } from "semantic-ui-react";
import { vpnClientConnectionDevicesPath } from "../constants/routes";
import CustomPagination from "../general/customPagination";
import OptionsMenu from "../general/optionsMenu";
import { longDash } from "./tools";
import { formatTableData, truncate } from "./tools";
import VpnCopyButton from "./vpnCopyButton";

const VpnDetailsTable = ({
  tableName,
  headers,
  reduxStateName,
  reduxFetchStatus,
  gatewayPublicHostname,
}) => {
  const { t } = useTranslation();
  const [activePageNumber, setActivePageNumber] = useState(1);
  const totalPaginationPages = 10;
  const pageViseted = totalPaginationPages * (activePageNumber - 1);
  const tableContentFromRedux =
    useSelector((state) => state.VpnStore[reduxStateName]) || [];
  const formattedTableContent =
    tableContentFromRedux.length !== 0
      ? formatTableData(tableContentFromRedux, tableName)
      : [];
  const fetchStatus = useSelector((state) => state.VpnStore[reduxFetchStatus]);
  const user = useSelector((state) => state.host.user);

  useEffect(() => {
    setActivePageNumber(1);
  }, [tableName]);

  const displayHeaders = headers.map((header, key) => (
    <Table.HeaderCell key={key}>
      {header !== "" ? t([header]) : ""}
    </Table.HeaderCell>
  ));

  const routeSubnetsPopup = (subnetsString) =>
    subnetsString.split(",").map((subnetRoute, key) => (
      <div key={key} className="flex">
        <div>{subnetRoute}</div>
        <VpnCopyButton copiedContent={subnetRoute} />
      </div>
    ));

  const returnPopupContent = {
    publicKey: (content) => ({
      cellContent: truncate(content, 12),
      popupContent: (
        <div className="flex">
          <div>{content}</div>
          <VpnCopyButton copiedContent={content} />
        </div>
      ),
    }),
    routeSubnets: (content) => ({
      cellContent: truncate(content),
      popupContent: <div>{routeSubnetsPopup(content)}</div>,
    }),
  };

  const addPopup = (content, header) => {
    const { cellContent, popupContent } = returnPopupContent[header](content);

    return (
      <div className="flex">
        {cellContent || content}
        &ensp;
        {cellContent && (
          <Popup
            on="click"
            pinned
            trigger={<div className="popup-dots">...</div>}
            inverted
            className="vpn"
          >
            {popupContent}
          </Popup>
        )}
      </div>
    );
  };

  const tableCells = (data) =>
    headers.map((header, key) => {
      let content = data[header] || longDash;
      if (["publicKey", "routeSubnets"].includes(header)) {
        content = addPopup(content, header);
      }

      if (tableName === "clientConnections" && header === "name") {
        content = (
          <Link to={vpnClientConnectionDevicesPath(data.id)}>{data.name}</Link>
        );
      } else if (tableName === "clientConnections" && header === "endpoint") {
        content = `${gatewayPublicHostname}:${data.port}`;
      } else if (header === "") {
        let type = "clientConnections";

        if (tableName === "clientConnections") {
          type = "vpnClientConnections";
        } else if (tableName === "peerGateways") {
          type = "vpnPeerGateways";
        } else if (tableName === "natMapping") {
          type = "vpnNatMapping";
        }

        content =
          user.role === "admin" || user.role === "owner" ? (
            <OptionsMenu
              type={type}
              instance={data}
              options={["edit", "delete"]}
            />
          ) : (
            ""
          );
      }

      return (
        <Table.Cell key={key} textAlign={header === "" ? "right" : "left"}>
          {content}
        </Table.Cell>
      );
    });

  const displayTableData = formattedTableContent
    .slice(pageViseted, pageViseted + totalPaginationPages)
    .map((item, key) => <Table.Row key={key}>{tableCells(item)}</Table.Row>);

  const determineServiceForEmptyState = {
    clientConnections: { listName: t("emptyClientConnections") },
    peerGateways: { listName: t("emptyPeerGateways") },
    natMapping: { listName: t("emptyNatDevices") },
  };

  return (
    <>
      <div
        className="table-container"
        style={totalPaginationPages >= 10 ? { minHeight: 390 } : {}}
      >
        <Table className="details-table" basic="very" padded>
          <Table.Header>
            <Table.Row>{displayHeaders}</Table.Row>
          </Table.Header>
          {fetchStatus !== "pending" && formattedTableContent.length !== 0 && (
            <Table.Body>{displayTableData}</Table.Body>
          )}
        </Table>
        {fetchStatus === "pending" && <Loader active inline="centered" />}
        {formattedTableContent.length === 0 && fetchStatus === "fulfilled" && (
          <div className="empty-table">
            {t("emptyListMessage", determineServiceForEmptyState[tableName])}
          </div>
        )}
      </div>

      <CustomPagination
        data={formattedTableContent}
        totalPaginationPages={10}
        setActivePageNumber={setActivePageNumber}
        activePageNumber={activePageNumber}
      />
    </>
  );
};

VpnDetailsTable.propTypes = {
  tableName: PropTypes.string,
  headers: PropTypes.array,
  reduxStateName: PropTypes.string,
  reduxFetchStatus: PropTypes.string,
  gatewayPublicHostname: PropTypes.string,
};

export default VpnDetailsTable;
