import React, { useEffect, useState } from "react";
import moment from "moment";

import { TableComponent } from "../../components/TableComponent";
import { fetchOperationMode } from "../../api/modeOperation";
import { AddButtonComponent } from "../../components/AddButtonComponent";
import { errorMessage } from "../../api/api-config/apiResponseMessage";

export const DOControlPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const divisionColumns = [
    {
      name: "Data Center",
      selector: (row) => row.name,
      wrap: true,
    },
    {
      name: "Device",
      selector: (row) => row.name,
      wrap: true,
    },
    {
      name: "Operation Mode",
      selector: (row) => row.name,
      wrap: true,
    },
    {
      name: "Time",
      selector: (row) => row.name,
      wrap: true,
    },

    {
      name: "Created Date",
      selector: (row) => moment(row.created_at).format("lll"),
      cell: (row) => (
        <div style={{ whiteSpace: "wrap" }}>
          {moment(row.created_at).format("lll")}
        </div>
      ),
    },
    {
      name: "Last Updated",
      selector: (row) => moment(row.updated_at).format("lll"),
      cell: (row) => (
        <div style={{ whiteSpace: "wrap" }}>
          {moment(row.updated_at).format("lll")}
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="container-fluid">
        <AddButtonComponent
          text="Configure"
          to="/admin/settings/do-control-form"
        />
        <div className="row">
          <div className="col-12">
            <TableComponent
              data={""}
              columns={divisionColumns}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
