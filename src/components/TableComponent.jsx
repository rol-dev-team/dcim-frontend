import React, { useState, useEffect, useContext, useMemo } from "react";
import DataTable from "react-data-table-component";
import { defaultThemes } from "react-data-table-component";


export const TableComponent = ({
  data,
  isLoading,
  columns
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
        background: "#EBEFF3",
        fontWeight: "bold",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "var(--secondary-bg-color)",
          cursor: "pointer",
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

  const filteredData = useMemo(() => {
    return (
        data &&
        data.filter((ticket) => {
        const ticketNumber = String(ticket.ticket_number || "");
        const client_name = (ticket.client_name || "").toLowerCase();
        const category_in_english = (
          ticket.category_in_english || ""
        ).toLowerCase();
        const sub_category_in_english = (
          ticket.sub_category_in_english || ""
        ).toLowerCase();
        const team = (ticket.team_name || "").toLowerCase();
        const created_by = (ticket.created_by || "").toLowerCase();

        const match =
          ticketNumber.includes(searchText) ||
          client_name.includes(searchText.toLowerCase()) ||
          category_in_english.includes(searchText.toLowerCase()) ||
          sub_category_in_english.includes(searchText.toLowerCase()) ||
          team.includes(searchText.toLowerCase()) ||
          created_by.includes(searchText.toLowerCase());
        return match;
      })
    );
  }, [data, searchText]);

 

  

  const handleGetRowId = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };
  

  return (
    <DataTable
                  columns={columns}
                  data={filteredData}
                  progressPending={isLoading}
                  fixedHeader
                  fixedHeaderScrollHeight='510px'
                  pagination
                  paginationPerPage={rowsPerPage}
                  paginationRowsPerPageOptions={[10, 20, 30, 50, 75, 100]}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  selectableRows
                  onSelectedRowsChange={handleGetRowId}
                  clearSelectedRows={toggledClearRows}
                  customStyles={customStyles}
                  dense
                  responsive
                  persistTableHead
                />
  );
};
