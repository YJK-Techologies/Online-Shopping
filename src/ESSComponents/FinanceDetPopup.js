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
    headerName: "Employee Last Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Type",
    field: "salaryType",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Pay Scale",
    field: "Payscale",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "PF No",
    field: "PFNo",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Per Annum",
    field: "salary_month",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department ID",
    field: "department_id",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};


export default function FinanceDetailsPopup({ open, handleClose, finaceDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [payScale, setPayScale] = useState("");
  const [salaryPerAnnum, setSalaryPerAnnum] = useState("");

  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    setLoading(true)
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const salaryValue = salaryPerAnnum === "" ? 0 : parseInt(salaryPerAnnum, 10);
      const response = await fetch(`${config.apiBaseUrl}/getFinancialDetailsSearchCretria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, salaryType, Name, Payscale: payScale, salary_month: salaryValue, company_code })
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
        setRowData([]);
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
    setSalaryType("");
    setPayScale("");
    setSalaryPerAnnum("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      salaryType: row.salaryType,
      Payscale: row.Payscale,
      PFNo: row.PFNo,
      salaryMonth: row.salary_month,
      first_name: row.first_name,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    finaceDetails(selectedData);
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
                  <h1 className="custom-modal-title">Financial Details Help</h1>

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
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee ID</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Name}
                      onChange={(e) => setname(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Employee Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Type</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={payScale}
                      onChange={(e) => setPayScale(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Payscale</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={salaryPerAnnum}
                      onChange={(e) => setSalaryPerAnnum(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Salary Per Annum</label>
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