import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee Id",
    field: "EmployeeId",
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "first_name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Employee Last  Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: true,
  },
  {
    headerName: "Relation",
    field: "Relation",
    editable: false,
  },
  {
    headerName: "Name",
    field: "Name",
    editable: false,
  },
  {
    headerName: "DOB",
    field: "Date_of_Birth",
    editable: false,
  },
  {
    headerName: "Age",
    field: "AGE",
    editable: false,
  },
  {
    headerName: "Id",
    field: "aadhar_no",
    editable: false,
  },
  {
    headerName: "Departmeny ID",
    field: "department_id",
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};


export default function FinanceDetailsPopup({ open, handleClose, familyDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [relation, setRelation] = useState("");
  const [name, setName] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    setLoading(true)
    try {

      const response = await fetch(`${config.apiBaseUrl}/getFamilyDetailsSearchCretria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, Relation: relation, EmployeeName, Name: name, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
        setRowData([]);
        clearInputs([])
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
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
    setName("");
    setRelation("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    familyDetails(selectedData);
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

              {/* HEADER */}
              <div className="shadow-lg p-2 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Family Help</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClose}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM SECTION */}
              <div className="form-row shadow-lg p-3 bg-light mt-2 container-form-box">

                <div className="form-block col-md-3 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={EmployeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Relation</label>
                  </div>
                </div>

                <div className="form-block col-md-3 col-sm-6 mb-2">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoComplete="off"
                    />
                    <label className="exp-form-labels">Name</label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-block col-12 mt-2">
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

              {/* TABLE SECTION */}
              <div className="shadow-lg p-3 pb-0 bg-light mt-2 container-form-box">
                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    pagination={true}
                    paginationAutoPageSize={true}
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