import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "First_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Last Name",
    field: "Last_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Account Holder Name",
    field: "AccountHolderName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Account NO",
    field: "Account_NO",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "IFSC Code",
    field: "IFSC_Code",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Bank Name",
    field: "bankName",
    editable: "false",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Branch Name",
    field: "branchName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Department ID",
    field: "department_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Bankbook Image",
    field: "Bankbook_img",
    editable: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      if (params.value) {
        return (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Item"
            style={{ width: "50px", height: "50px" }}
          />
        );
      } else {
        return "No Image";
      }
    },
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function Bankaccdetpopup({ open, handleClose, Employeebankdetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Account_NO, setAccountNumber] = useState("");
  const [AccountHolderName, setAccountHolderName] = useState("");
  const [bankName, setbankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [IFSC_Code, setIFSCCode] = useState("");
  const [Bankbook_img, setBankbook_img] = useState("");
  const [Name, setname] = useState("");
  const [loading, setLoading] = useState(false);


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const handleSearch = async () => {
    const company_code = sessionStorage.getItem('selectedCompanyCode')
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmpBankDetailsSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, Account_NO, Name, AccountHolderName, bankName, IFSC_Code, Bankbook_img, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            Account_NO: item.Account_NO,
            AccountHolderName: item.AccountHolderName,
            IFSC_Code: item.IFSC_Code,
            bankName: item.bankName,
            branchName: item.branchName,
            Bankbook_img: item.Bankbook_img ? arrayBufferToBase64(item.Bankbook_img.data) : null,

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
    setAccountNumber("");
    setAccountHolderName("");
    setbankName("");
    setBranchName("");
    setIFSCCode("");
    setBankbook_img("");

  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      Account_NO: row.Account_NO,
      AccountHolderName: row.AccountHolderName,
      bankName: row.bankName,
      branchName: row.branchName,
      IFSC_Code: row.IFSC_Code,
      Bankbook_img: row.Bankbook_img,
      department_ID: row.department_id,
      designation_ID: row.designation_id,
      first_name: row.first_name
    }));


    Employeebankdetails(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
    setSelectedRows([]);
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
                  <h1 className="custom-modal-title">Bank Accounts Details Help</h1>

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
                      maxLength={18}
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
                      value={AccountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Account Holder Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Account_NO}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Account No</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={bankName}
                      onChange={(e) => setbankName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Bank Name</label>
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
