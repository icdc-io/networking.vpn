import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

const StatusLabel = React.memo(({ active }) => {
  const { t } = useTranslation();

  return (
    <div
      className={active ? "status-label green-text" : "status-label gray-text"}
    >
      {active ? t("enabled") : t("disabled")}
    </div>
  );
});

StatusLabel.displayName = "StatusLabel";

StatusLabel.propTypes = {
  active: PropTypes.bool,
};

export default StatusLabel;
