import React, { useEffect, useState } from 'react';
import moment from "moment";
import { AddButtonComponent } from '../../components/AddButtonComponent';
import { TableComponent } from '../../components/TableComponent';
import { errorMessage } from '../../api/api-config/apiResponseMessage';
import { fetchAllDivisions } from '../../api/settings/divisionApi';

export const Divisions = () => {
  const [data,setData]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  const divisionColumns = [
   
    {
      name: "Division Name",
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
  useEffect(() => {
    setIsLoading(true);
     fetchAllDivisions()
       .then((response) => {
        setData(response.data);
        console.log(response);
       })
       .catch(errorMessage)
       .finally(() => {
         setIsLoading(false);
       });
   }, []);

  return (
    <div className='container-fluid'>
      <AddButtonComponent to="/admin/settings/add-division"/>
      <div className='row'>
        <div className='col-12'>
          <TableComponent data={data} columns={divisionColumns} isLoading={isLoading}/>
        </div>
        
      </div>
    </div>
  )
}
