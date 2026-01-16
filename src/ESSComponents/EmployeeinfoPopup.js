import { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingScreen from '../Loading';

const config = require('../Apiconfig');

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    editable: false,
  },
  {
    headerName: "DOB",
    field: "DOB",
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Image",
    field: "Photos",
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
  {
    headerName: "First Name",
    field: "First_Name",
    editable: false,
  },
  {
    headerName: "Middle Name",
    field: "Middle_Name",
    editable: false,
  },
  {
    headerName: "Last Name",
    field: "Last_Name",
    editable: false,
  },
  {
    headerName: "Father Name",
    field: "father_name",
    editable: false,
  },
  {
    headerName: "Mother Name",
    field: "mother_name",
    editable: false,
  },
  {
    headerName: "Gender",
    field: "Gender",
    editable: false,
  },
  {
    headerName: "Email",
    field: "email",
    editable: false,
  },
  {
    headerName: "Grade ID",
    field: "Grade_id",
    editable: false,
  },
  {
    headerName: "Phone No",
    field: "phone1",
    editable: false,
  },
  {
    headerName: "Alter Phone No",
    field: "phone2",
    editable: false,
  },
  {
    headerName: "Address 1",
    field: "address1",
    editable: false,
  },
  {
    headerName: "Address 2",
    field: "address2",
    editable: false,
  },
  {
    headerName: "Address 3",
    field: "address3",
    editable: false,
  },
  {
    headerName: "Permanent Address",
    field: "PermanantAddress",
    editable: false,
    minWidth: 160,
    maxWidth: 200,
  },
  {
    headerName: "Reference Name",
    field: "Reference_name",
    editable: false,
  },
  {
    headerName: "Reference Phone No",
    field: "Reference_Phone",
    editable: false,
  },
  {
    headerName: "Martial Status",
    field: "marital_status",
    editable: false,
  },
  {
    headerName: "PAN No",
    field: "Pan_No",
    editable: false,
  },
  {
    headerName: "Aadhaar No",
    field: "Aadhar_no",
    editable: false,
  },
  {
    headerName: "Kids",
    field: "Kids",
    editable: false,
  },
  {
    headerName: "Department ID",
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


export default function EmployeeInfoPopup({ open, handleClose, EmployeeInfo }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [DOB, setDOB] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
     setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeePersonalSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, Last_Name, First_Name, DOB, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            First_Name: item.First_Name,
            Middle_Name: item.Middle_Name,
            Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,
            Father_Name: item.father_name,
            Last_Name: item.Last_Name,
            Mother_Name: item.mother_name,
            DOB: item.DOB,
            selectedGender: item.Gender,
            Email: item.email,
            Phone1: item.phone1,
            Phone2: item.phone2,
            address1: item.address1,
            address2: item.address2,
            address3: item.address3,
            permanantAddress: item.PermanantAddress,
            reference_Name: item.Reference_name,
            reference_Phone: item.Reference_Phone,
            pan_No: item.Pan_No,
            Aadhaar_no: item.Aadhar_no,
            selectedmartial: item.marital_status,
            selectedkids: item.Kids,
            selectedgradeid: item.Grade_id,
            company_code: sessionStorage.getItem('selectedCompanyCode'),
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
      console.error("Error fetching search data:", error);
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
    setFirst_Name("");
    setLast_Name("");
    setDOB("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      DOB: row.DOB,
      First_Name: row.First_Name,
      Middle_Name: row.Middle_Name,
      Last_Name: row.Last_Name,
      Father_Name: row.father_name,
      Mother_Name: row.mother_name,
      Gender: row.Gender,
      Email: row.email,
      grade_id: row.Grade_id,
      phone1: row.phone1,
      phone2: row.phone2,
      Address1: row.address1,
      Address2: row.address2,
      Address3: row.address3,
      PermanantAddress: row.PermanantAddress,
      Reference_Name: row.Reference_name,
      Reference_Phone: row.Reference_Phone,
      Marital_Status: row.marital_status,
      Pan_No: row.Pan_No,
      Aadhar_no: row.Aadhar_no,
      Kids: row.Kids,
      Photos: row.Photos,
      designation_id: row.designation_id,
      department_id: row.department_id,
    }));

    EmployeeInfo(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
  }

  return (
    <div>
      {open && (
        <div className="modal-overlay">
      {loading && <LoadingScreen />}
          <div className="custom-modal con  tainer-fluid Topnav-screen">
            <div className="custom-modal-body">

              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Employee Info Help</h1>

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
                      type="date"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={DOB}
                      onChange={(e) => setDOB(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">DOB</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={First_Name}
                      onChange={(e) => setFirst_Name(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">First Name</label>
                  </div>
                </div>

                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={Last_Name}
                      onChange={(e) => setLast_Name(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <label className="exp-form-labels">Last Name</label>
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
