import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "first_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Last  Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department",
    field: "department_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation",
    field: "designation_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "DOJ",
    field: "DOJ",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "DOL",
    field: "DOL",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "Manager",
    field: "manager",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Shift",
    field: "shift",
    editable: false,
  },
  {
    headerName: "Status",
    field: "status",
    filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function Companydetailpopup({ open, handleClose, CompanyDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Department, setDepartment] = useState("");
  const [Designation, setDesignation] = useState("");
  const [DOJ, setDOJ] = useState("");
  const [manager, setManager] = useState("");
  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeeCompanyISC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmployeeId, Department, Designation, manager, Name, company_code: sessionStorage.getItem('selectedCompanyCode')

        })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            Department: item.Department,
            designation_Id: item.Designation,
            DOJ: item.DOJ,
            DOL: item.DOL,
            manager: item.manager,
            shift: item.shift,
            status: item.status,
            // First_Name: item.First_Name,
            // Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,

          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
        setRowData([]);
        clearInputs([])
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setEmployeeId("");
    setDepartment("");
    setDesignation("");
    setDOJ("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      Department: row.department_ID,
      Designation: row.designation_ID,
      DOJ: row.DOJ,
      DOL: row.DOL,
      manager: row.manager,
      shift: row.shift,
      status: row.status,
      first_name: row.first_name
    }));
    CompanyDetails(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
  }

  return (
    <div>
      {open && (
        <div className="modal-overlay">
      {loading && <LoadingScreen />}
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Company Details Help</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClose}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row shadow-lg p-2 bg-light mt-2 container-form-box">

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      className="exp-input-field form-control"
                      value={Name}
                      onChange={(e) => setname(e.target.value)}
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      value={Department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <label className="exp-form-labels">Department</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      value={Designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                    <label className="exp-form-labels">Designation</label>
                  </div>
                </div>

                <div className="form-block col-12">
                  <div className="search-btn-wrapper">
                    <div className="icon-btn search" onClick={handleSearch}>
                      <span className="tooltip">Search</span>
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div className="icon-btn reload" onClick={handleReload}>
                      <span className="tooltip">Reload</span>
                      <i className="fa-solid fa-rotate-right"></i>
                    </div>

                    <div className="icon-btn save" onClick={handleConfirm}>
                      <span className="tooltip">Confirm</span>
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shadow-lg p-3 pb-0 bg-light mt-2 container-form-box">
                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    pagination={true}
                    gridOptions={gridOptions}
                    onSelectionChanged={handleRowSelected}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}