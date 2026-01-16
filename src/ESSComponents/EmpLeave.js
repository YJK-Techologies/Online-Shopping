import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select'
import { showConfirmationToast } from '../ToastConfirmation';
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {

  const [error, setError] = useState("");
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [Leaveid, setLeaveid] = useState('');
  const [filtercode, setFilterCode] = useState('');
  const [type, settype] = useState('');
  const [accrual, setaccrual] = useState('');
  const [Exceedleave, setExceedleave] = useState('');
  const [rowData, setrowData] = useState([]);
  const [LeaveId, setLeaveId] = useState('');
  const [Description, setDescription] = useState("");
  const [code, setcode] = useState("");
  const [Type, setType] = useState('');
  const [Accrual, setAccrual] = useState("");
  const [TotalDaystoBeCredit, setTotalDaystoBeCredit] = useState("");
  const [carryForward, setcarryForward] = useState("");
  const [Exceed_Leave, setExceed_Leave] = useState("");
  const [LeaveReason, setLeaveReason] = useState("");
  const [TypeDrop, setTypeDrop] = useState([]);
  const [typedrop, settypedrop] = useState([]);
  const [TypeGriddrop, setTypeGriddrop] = useState([]);
  const [AccuralGriddrop, setAccuralGriddrop] = useState([]);
  const [SelectedType, setSelectedType] = useState("");
  const [selectedtype, setselectedtype] = useState("");
  const [SelectedAccrual, setSelectedAccrual] = useState("");
  const [selectedaccrual, setSelectedaccrual] = useState("");
  const [AccrualDrop, setAccrualDrop] = useState([]);
  const [accrualDrop, setaccuraldrop] = useState([]);
  const [LeaveReasonDrop, setLeaveReasonDrop] = useState([]);
  const [LevReasonGriddrop, setLevReasonGriddrop] = useState([]);
  const [SelectedLeaveReason, setSelectedLeaveReason] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true)
  const [isSelectedType, setIsSelectType] = useState(false);
  const [isSelectedAccrual, setIsSelectAccrual] = useState(false);
  const [isSelectedLeaveReason, setIsSelectLeaveReason] = useState(false);
  const [isSelecttypes, setIsSelecttypes] = useState(false);
  const [isSelectAL, setIsSelectAL] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/getLeaveTypeSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          LeaveId: Leaveid,
          code: filtercode,
          Type: type,
          Accrual: accrual,
          Exceed_Leave: Exceedleave,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setrowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setrowData([]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Leave ID",
      field: "LeaveId",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Description",
      field: "Description",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Code",
      field: "code",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Type",
      field: "Type",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: TypeGriddrop,
        maxLength: 10,
      },
    },
    {
      headerName: "Accural",
      field: "Accrual",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: AccuralGriddrop,
        maxLength: 10,
      },
    },
    {
      headerName: "Total Days to be Credit",
      field: "TotalDaystoBeCredit",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Carry Forward",
      field: "carryForward",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Exceed Leave",
      field: "Exceed_Leave",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Leave Reason",
      field: "LeaveReason",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: LevReasonGriddrop,
        maxLength: 250,
      },
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  //search code
  const filterOptiontype = typedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handletype = (selectedtype) => {
    setselectedtype(selectedtype);
    settype(selectedtype ? selectedtype.value : '');
  };

  const filterOptionType = TypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleType = (SelectedType) => {
    setSelectedType(SelectedType);
    setType(SelectedType ? SelectedType.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setTypeDrop(val)
        settypedrop(val)
      });
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const TypesOption = data.map(option => option.attributedetails_name);
        setTypeGriddrop(TypesOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAccrual = (selectedAccrual) => {
    setSelectedAccrual(selectedAccrual);
    setAccrual(selectedAccrual ? selectedAccrual.value : '');
  };

  const handleaccrual = (selectedaccrual) => {
    setSelectedaccrual(selectedaccrual);
    setaccrual(selectedaccrual ? selectedaccrual.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAccrual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setAccrualDrop(val);
        setaccuraldrop(val);
      });
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getAccrual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const AccuralOption = data.map(option => option.attributedetails_name);
        setAccuralGriddrop(AccuralOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filterOptionAccrual = AccrualDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filterOptionaccrual = accrualDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getLeaveReason`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const LeaveOption = data.map(option => option.attributedetails_name);
        setLevReasonGriddrop(LeaveOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filterOptionLeaveReason = LeaveReasonDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleLeaveReason = (selectedLeaveReason) => {
    setSelectedLeaveReason(selectedLeaveReason);
    setLeaveReason(selectedLeaveReason ? selectedLeaveReason.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveReason`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveReasonDrop(val));
  }, []);

  const handleSave = async () => {
    if (
      !LeaveId ||
      !Description ||
      !code ||
      !Type ||
      !Accrual ||
      !TotalDaystoBeCredit ||
      !Exceed_Leave ||
      !LeaveReason

    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const Header = {
        LeaveId,
        Description,
        code,
        Type,
        Accrual,
        TotalDaystoBeCredit,
        carryForward,
        Exceed_Leave,
        LeaveReason,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addLeaveType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert EmployeeLeave data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const saveEditedData = async () => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/UpdateLeaveType `, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified_by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
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
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async (rowData) => {
    const LeaveIdDelete = { LeaveIdToDelete: Array.isArray(rowData) ? rowData : [rowData] };

    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          setLoading(true);
          const response = await fetch(`${config.apiBaseUrl}/deleteLeave`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(LeaveIdDelete),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        } finally {
      setLoading(false);
    }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const reloadData = () => {
    setrowData([])
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Add Leave Type</h1>
          <div className="action-wrapper desktop-actions">
            <div class=" d-flex justify-content-end  me-3">
              {saveButtonVisible && (
                <div className="action-icon add" onClick={handleSave}>
                  <span className="tooltip">save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              )}
              <div className="action-icon print" onClick={reloadGridData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {/* {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && ( */}
                {saveButtonVisible && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
                 )}
              {/* )} */}

              <li className="dropdown-item" onClick={reloadGridData}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </li>

            </ul>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="LeaveId"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Leave ID"
                value={LeaveId}
                onChange={(e) => setLeaveId(e.target.value)}
                maxLength={150}
              />
              <label className={` exp-form-labels ${error && !LeaveId ? 'text-danger' : ''}`}>Leave ID{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="Description"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={250}
              />
              <label className={` exp-form-labels ${error && !Description ? 'text-danger' : ''}`}>Description{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="code"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Code"
                value={code}
                onChange={(e) => setcode(e.target.value)}
                maxLength={250}
              />
              <label className={` exp-form-labels ${error && !code ? 'text-danger' : ''}`}>Code{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${SelectedType ? "has-value" : ""} 
              ${isSelectedType ? "is-focused" : ""}`}
            >
              <Select
                id="Type"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectType(true)}
                onBlur={() => setIsSelectType(false)}
                classNamePrefix="react-select"
                isClearable
                value={SelectedType}
                onChange={handleType}
                options={filterOptionType}
              />
              <label className={` floating-label ${error && !Type ? 'text-danger' : ''}`}>Type{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${SelectedAccrual ? "has-value" : ""} 
              ${isSelectedAccrual ? "is-focused" : ""}`}
            >
              <Select
                id="Accrual	"
                placeholder=" "
                onFocus={() => setIsSelectAccrual(true)}
                onBlur={() => setIsSelectAccrual(false)}
                classNamePrefix="react-select"
                isClearable
                value={SelectedAccrual}
                onChange={handleAccrual}
                options={filterOptionAccrual}
                maxLength={50}
              />
              <label className={`floating-label ${error && !Accrual ? 'text-danger' : ''}`}>Accrual{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="TotalDaystoBeCredit"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Value for Total Days to be Credit "
                value={TotalDaystoBeCredit}
                onChange={(e) => setTotalDaystoBeCredit(e.target.value)}
              />
              <label className={`exp-form-labels ${error && !TotalDaystoBeCredit ? 'text-danger' : ''}`}>Total Days to be Credit{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="carryForward"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Value for Carry Forward"
                value={carryForward}
                onChange={(e) => setcarryForward(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !carryForward ? 'text-danger' : ''}`}>Carry Forward{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="Exceed_Leave"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Value for Exceed Leave"
                value={Exceed_Leave}
                onChange={(e) => setExceed_Leave(e.target.value)}
              />
              <label className={` exp-form-labels ${error && !Exceed_Leave ? 'text-danger' : ''}`}>Exceed Leave{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${SelectedLeaveReason ? "has-value" : ""} 
              ${isSelectedLeaveReason ? "is-focused" : ""}`}
            >
              <Select
                id="LeaveReason"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectLeaveReason(true)}
                onBlur={() => setIsSelectLeaveReason(false)}
                classNamePrefix="react-select"
                isClearable
                value={SelectedLeaveReason}
                onChange={handleLeaveReason}
                options={filterOptionLeaveReason}
              />
              <label className={` floating-label ${error && !LeaveReason ? 'text-danger' : ''}`}>Leave Reason{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h5 className="">Search Criteria:</h5>
        </div>
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                type="text"
                className="exp-input-field form-control"
                placeholder=""
                required title="Please Enter the Leave ID"
                value={Leaveid}
                onChange={(e) => setLeaveid(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <label class="exp-form-labels">Leave ID</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input type="text"
                className="exp-input-field form-control"
                placeholder=""
                required title="Please Enter the Code"
                value={filtercode}
                onChange={(e) => setFilterCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <label class="exp-form-labels">Code</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedtype ? "has-value" : ""} 
              ${isSelecttypes ? "is-focused" : ""}`}
            >
              <Select type="text"
                required
                value={selectedtype}
                onChange={handletype}
                options={filterOptiontype}
                placeholder=" "
                onFocus={() => setIsSelecttypes(true)}
                onBlur={() => setIsSelecttypes(false)}
                classNamePrefix="react-select"
                isClearable
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <label className="floating-label">Type</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedaccrual ? "has-value" : ""} 
              ${isSelectAL ? "is-focused" : ""}`}
            >
              <Select type="text"
                required
                placeholder=" "
                onFocus={() => setIsSelectAL(true)}
                onBlur={() => setIsSelectAL(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedaccrual}
                onChange={handleaccrual}
                options={filterOptionaccrual}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <label className="floating-label">Accrual</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input type="text"
                className="exp-input-field form-control"
                required title="Please Enter the Exceed Leave Value"
                placeholder=""
                value={Exceedleave}
                onChange={(e) => setExceedleave(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <label class="exp-form-labels">Exceed Leave</label>
            </div>
          </div>

          {/* Search + Reload Buttons */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>

  );
}
export default Input;
