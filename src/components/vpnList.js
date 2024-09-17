import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import DeleteModal from '../../GeneralComponents/deleteModal';
import { Link } from "react-router-dom";
import { Table } from "semantic-ui-react";
import CustomPagination from "../general/customPagination";
import OptionsMenu from "../general/optionsMenu";
import svgVpn from "../static/svgVpn.svg";
import searchMethod from "../utilities/searchFunction";
import { longDash } from "./tools";
import { formatVpnGatewaysData } from "./tools";

const VpnList = ({ items: gatewaysData, searchTerm }) => {
  const { t } = useTranslation();
  const [direction, setDirection] = useState("ascending");
  const [column, setColumn] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [activePageNumber, setActivePageNumber] = useState(1);
  const totalPaginationPages = 8;
  const pageViseted = totalPaginationPages * (activePageNumber - 1);

  useEffect(() => {
    setGateways(formatVpnGatewaysData(gatewaysData));
  }, [gatewaysData]);

  const headers = [
    { name: "name", headerName: "name", sortable: true },
    { name: "publicKey", headerName: "publicKey", sortable: false },
    { name: "hostname", headerName: "publicHostnameVpn", sortable: false },
    { name: "natSubnet", headerName: "natSubnet", sortable: false },
    { name: "menu", headerName: "", sortable: false },
  ];

  const handleSort = (columnName) => {
    if (column !== columnName) {
      setColumn(columnName);
      setGateways(_.sortBy(gateways, [columnName]));
      setDirection("ascending");
      return;
    }

    direction === "ascending"
      ? setDirection("descending")
      : setDirection("ascending");
    setGateways(gateways.reverse());
  };

  const displayHeaders = headers.map((item, key) => (
    <Table.HeaderCell
      key={key}
      sorted={column === item.name ? direction : null}
      onClick={() => {
        if (item.sortable) {
          handleSort(item.name);
        }
      }}
    >
      {item.headerName ? t(item.headerName) : ""}
    </Table.HeaderCell>
  ));

  const tableCells = (gateway) => {
    const tableRow = headers.map((header, key) => {
      let content = gateway[header.name];

      if (header.name === "name") {
        content = (
          <div className="gateway-name-container">
            <img src={svgVpn} alt="Gateway" />
            <Link to={`${gateway.id}`}>{content}</Link>
          </div>
        );
      }
      // if (header.name === 'natSubnet') {
      //     content = <>{content} <VpnModal
      //     button
      //     pencil
      //     edit
      //     data={gateway}
      //     formFields={['natSubnet']}
      //     editContentMessage={'editNatSubnet'}
      //     managementName='gateway'/></>;
      // }

      if (header.name === "menu") {
        content = (
          <OptionsMenu type="gateways" instance={gateway} options={["edit"]} />
        );
      }
      // else if (header.name === 'deleteButton') {
      //     content = (<DeleteModal icon type='gateway' instance={vpnGateway} />);
      // }

      return (
        <Table.Cell
          key={key}
          textAlign={header.name === "menu" ? "right" : "left"}
        >
          {content || longDash}
        </Table.Cell>
      );
    });
    return tableRow;
  };

  const searchTableData = searchTerm
    ? searchMethod(
        gateways,
        searchTerm,
        ["name", "publicKey", "hostname", "natSubnet"],
        ["natSubnet"],
      )
    : gateways;

  const displayTableData = searchTableData
    .slice(pageViseted, pageViseted + totalPaginationPages)
    .map((item, key) => <Table.Row key={key}>{tableCells(item)}</Table.Row>);

  return (
    <>
      <div className="table-container">
        <Table
          className="vpn-list-table"
          selectable={false}
          padded
          sortable
          basic="very"
        >
          <Table.Header>
            <Table.Row>{displayHeaders}</Table.Row>
          </Table.Header>
          <Table.Body>{displayTableData}</Table.Body>
        </Table>

        {searchTerm && searchTableData.length === 0 && (
          <div className="empty-table">{t("noSearchResults")}</div>
        )}
      </div>

      <CustomPagination
        data={searchTableData}
        totalPaginationPages={totalPaginationPages}
        activePageNumber={activePageNumber}
        setActivePageNumber={setActivePageNumber}
        searchTerm={searchTerm}
      />
    </>
  );
};

VpnList.propTypes = {
  items: PropTypes.array,
  searchTerm: PropTypes.string,
};

export default VpnList;
