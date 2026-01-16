import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format } from 'date-fns';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const LeaveRequestPage = () => {
  const [LeaveType, setLeaveType] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [Reason, setReason] = useState("");
  const [Select_slots, setSelect_Slots] = useState("");
  const [AlternativeReponsablePerson, setReasponsiblePerson] = useState("");
  const [ReportingManager, setReportingManager] = useState("");
  const [LeaveDrop, setLeaveDrop] = useState([]);
  const [SelectedLeave, setSelectedLeave] = useState("");
  const navigate = useNavigate();
  const [SlotDrop, setSlotDrop] = useState([]);
  const [SelectedSlot, setSelectedSlot] = useState("");
  const [rowData, setrowData] = useState([]);
  const [error, setError] = useState('');
  const [Managerdrop, setManagerdrop] = useState([]);
  const [selectedmanager, setselectedmanager] = useState('');
  const gridRef = useRef()
  const [loading, setLoading] = useState(false);
  const [isSelectLeave, setIsSelectLeave] = useState(false);
  const [isSelectSlot, setIsSelectSlot] = useState(false);
  const [isSelectManager, setIsSelectManager] = useState(false);
  const [isSearchLeave, setIsSearchLeave] = useState(false);
  const [isSearchStatus, setIsSearchStatus] = useState(false);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getapplyLeavetype`,{
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //   company_code: sessionStorage.getItem("selectedCompanyCode"),
  //   })
  // })
  //     .then((data) => data.json())
  //     .then((val) => setLeaveDrop(val));
  // }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveDrop(val))
  }, []);

  const filterOptionLeaveType = LeaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }));


  const handleLeaveType = (SelectedLeave) => {
    setSelectedLeave(SelectedLeave);
    setLeaveType(SelectedLeave ? SelectedLeave.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSelectslot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSlotDrop(val));
  }, []);


  // useEffect(() => {
  // //   fetch(`${config.apiBaseUrl}/getSelectslot`)
  //  .then((data) => data.json())
  //     .then((val) => setSlotDrop(val));
  // }, []);


  const filterOptionSelect_Slots = SlotDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleSelect_Slots = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
    setSelect_Slots(selectedSlot ? selectedSlot.value : '');
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    validateDates(FromDate, e.target.value);
  };

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
    validateDates(ToDate, e.target.value);
  };

  const validateDates = (FromDate, ToDate) => {
    if (FromDate && ToDate) {
      const fromDateObj = new Date(FromDate);
      const toDateObj = new Date(ToDate);

      if (fromDateObj > toDateObj) {
        toast.warning("From Date should not be after To Date");
      } else {
        setError("");
      }
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getEmployeeTotalLeaveBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setrowData(val));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!LeaveType ||
      !FromDate ||
      !ToDate ||
      !Select_slots ||
      !Reason ||
      !ReportingManager ||
      !AlternativeReponsablePerson) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    const formData = {
      LeaveType,
      FromDate,
      ToDate,
      Select_slots,
      Reason,
      ReportingManager,
      EmployeeId: sessionStorage.getItem("selectedUserCode"),
      company_code: sessionStorage.getItem('selectedCompanyCode'),
      created_by: sessionStorage.getItem("selectedUserCode"),
      AlternativeReponsablePerson,
    };
    setLoading(true);
    try {

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeLeave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form Submitted Successfully", data);
        toast.success("Form Submitted Successfully");
        // setLeaveType("");
        // setFromDate("");
        // setToDate("");
        // setSelect_Slots("");
        // setReason("");
        // setReportingManager("");
        // setReasponsiblePerson("");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Something went wrong.'}`);
      }

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [columnDefs] = useState([
    { headerName: 'Leave Type', field: 'leavetype', sortable: true, filter: true },
    { headerName: 'No of Leaves', field: 'creditedleave', sortable: true, filter: true },
    { headerName: 'No of Available Leaves', field: 'availableleave', sortable: true, filter: true },
  ]);


  const goBack = () => {
    navigate('/EmployeeDashboard');
  };

  const handleClose = () => {
    setOpen(false);

  };

  const [open, setOpen] = React.useState(false);
  const handleadjustmentbtn = () => {
    setOpen(true);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setReportingManager(selectedOption ? selectedOption.value : '');
  };

  const [leaveRowData, setLeaveRowData] = useState([]);
  const [leaveDrop, setleaveDrop] = useState([]);
  const [statusDrop, setstatusDrop] = useState([]);
  const [leaveType, setleaveType] = useState("");
  const [selectedLeave, setselectedLeave] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [LeaveStatus, setleaveStatus] = useState("");

  const leaveColumnDefs = [
    {
      checkboxSelection: true,
      headerName: "Leave Type",
      field: "LeaveType",
      cellStyle: { textAlign: "center" },
      editable: false,
    },
    {
      headerName: "From Date",
      field: "FromDate",
      editable: false,
      cellStyle: { textAlign: "center" },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "To Date",
      field: "ToDate",
      editable: false,
      cellStyle: { textAlign: "center" },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "Leave Status",
      field: "LeaveStatus",
      editable: false,
      cellStyle: { textAlign: "center" },
    },
  ];

  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeLeavesearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
          FromDate:fromDate,
          ToDate:toDate,
          LeaveStatus:LeaveStatus,
          LeaveType:leaveType
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setLeaveRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        setLeaveRowData([]);
        clearInputs([]);
        toast.warning("Data not found")
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        })
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setLeaveRowData([])
  };

  const clearInputs = () => {
    setfromDate('');
    settoDate('');
    setleaveStatus('');
    setleaveType('');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setleaveDrop(val))
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDrop(val))
  }, []);

  const filterOptionLeaves = [{ value: 'All', label: 'All' }, ...leaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }))];

  const filterOptionStatus = [{ value: 'All', label: 'All' }, ...statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleLeaves = (SelectedLeave) => {
    setselectedLeave(SelectedLeave);
    setleaveType(SelectedLeave ? SelectedLeave.value : '');
  };

  const handleStatus = (SelectedStatus) => {
    setselectedStatus(SelectedStatus);
    setleaveStatus(SelectedStatus ? SelectedStatus.value : '');
  };

  const handleConfirm = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select a row to load data");
      return;
    }

    const row = selectedRows[0];

    // Update all fields with selected row values
    setSelectedLeave({
      value: row.LeaveType,
      label: row.LeaveType,
    });

    setFromDate(row.FromDate ? format(new Date(row.FromDate), "yyyy-MM-dd") : "");
    setToDate(row.ToDate ? format(new Date(row.ToDate), "yyyy-MM-dd") : "");
    setleaveStatus(row.LeaveStatus || "");
  };

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // flex: 1
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
            <h1 className="page-title">Apply Leave</h1>
          <div className="action-wrapper">
            <div className="action-icon delete" onClick={goBack}>
              <span className="tooltip">Close</span>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-8">
            <div className="row g-3">

              <div className="col-md-6">
                <div
              className={`inputGroup selectGroup 
              ${SelectedLeave ? "has-value" : ""} 
              ${isSelectLeave ? "is-focused" : ""}`}
            >
                <Select
                  id="LeaveType"
                  value={SelectedLeave}
                  onChange={handleLeaveType}
                  options={filterOptionLeaveType}
                  placeholder=" "
                onFocus={() => setIsSelectLeave(true)}
                onBlur={() => setIsSelectLeave(false)}
                classNamePrefix="react-select"
                isClearable
                />
                <label className={`floating-label ${error && !LeaveType ? 'text-danger' : ''}`}>
                  Leave Type<span className="text-danger">*</span>
                </label>
              </div>
              </div>

              <div className="col-md-6">
                 <div
              className={`inputGroup selectGroup 
              ${SelectedSlot ? "has-value" : ""} 
              ${isSelectSlot ? "is-focused" : ""}`}
            >
                <Select
                  id="Select_slots"
                  value={SelectedSlot}
                  onChange={handleSelect_Slots}
                  options={filterOptionSelect_Slots}
                   placeholder=" "
                onFocus={() => setIsSelectSlot(true)}
                onBlur={() => setIsSelectSlot(false)}
                classNamePrefix="react-select"
                isClearable
                />
                <label className="floating-label">Select Slot</label>
              </div>
              </div>

              <div className="col-md-6">
                <div className="inputGroup">
                <input
                  type="date"
                  className="exp-input-field form-control"
                  value={FromDate}
                  onChange={handleFromDate}
                  placeholder=" "
                  autoComplete="off"
                />
                <label className={`exp-form-labels ${error && !FromDate ? 'text-danger' : ''}`}>
                  From Date<span className="text-danger">*</span>
                </label>
              </div>
              </div>

              <div className="col-md-6">
                <div className="inputGroup">
                <input
                  type="date"
                  className="exp-input-field form-control"
                  value={ToDate}
                  onChange={handleToDateChange}
                  placeholder=" "
                   autoComplete="off"
                />
                <label className={`exp-form-labels ${error && !ToDate ? 'text-danger' : ''}`}>
                  To Date<span className="text-danger">*</span>
                </label>
              </div>
              </div>

              <div className="col-md-12">
                <div className="inputGroup">
                <textarea
                  className="form-control"
                  value={Reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  placeholder=" "
                  autoComplete="off"
                />
                <label className={`exp-form-labels ${error && !Reason ? 'text-danger' : ''}`}>
                  Reason<span className="text-danger">*</span>
                </label>
              </div>
              </div>

              <div className="col-md-6">
                <div
              className={`inputGroup selectGroup 
              ${selectedmanager ? "has-value" : ""} 
              ${isSelectManager ? "is-focused" : ""}`}
            >
                <Select
                  value={selectedmanager}
                  options={filteredOptionManager}
                  onChange={handleChangemanager}
                  placeholder=" "
                onFocus={() => setIsSelectManager(true)}
                onBlur={() => setIsSelectManager(false)}
                classNamePrefix="react-select"
                isClearable
                />
                <label className={`floating-label ${error && !ReportingManager ? 'text-danger' : ''}`}>
                  Reporting Manager<span className="text-danger">*</span>
                </label>
              </div>
              </div>

              <div className="col-md-6">
                <div className="inputGroup">
                <input
                  type="text"
                  className="exp-input-field form-control"
                  value={AlternativeReponsablePerson}
                  onChange={(e) => setReasponsiblePerson(e.target.value)}
                  placeholder=" "
                  autoComplete="off"
                />
                <label className={`exp-form-labels ${error && !AlternativeReponsablePerson ? 'text-danger' : ''}`}>
                  Responsible Person<span className="text-danger">*</span>
                  </label>
              </div>
              </div>

            </div>
            <div class="col-12">
              {/* {leaveStatus !== "Pending" && leaveStatus !== "Approved" && (
                <button className="btn btn-primary" onClick={handleSave}>Apply</button>
              )}
              <button className="btn btn-secondary" onClick={handleadjustmentbtn}>
                Applied Leaves
              </button> */}
              {(LeaveStatus === "Pending" || LeaveStatus === "Rejected" || LeaveStatus === "") && (
                <div className="search-btn-wrapper">
                <div className="icon-btn save"  onClick={handleSave}>
                  <span className="tooltip">Apply</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
             <div className="inputGroup">
              <h5>Leave Balance</h5>
              <div className="ag-theme-alpine" style={{ height: 300, width: "100%", borderRadius: "10px" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  // rowHeight={30}
                  domLayout="autoHeight"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <LeavePopup open={open} handleClose={handleClose} handleLeave={handleLeave} /> */}
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <h5>Search Criteria :</h5>

        <div className="row g-3">

          <div className="col-md-2">
            <div className="inputGroup">
            <input
              type="date"
              className="exp-input-field form-control"
              value={fromDate}
               placeholder=" "
                autoComplete="off"
              onChange={(e) => setfromDate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
            <label className="exp-form-labels">From Date</label>
          </div>
          </div>

          <div className="col-md-2">
            <div className="inputGroup">
            <input
              type="date"
              className="exp-input-field form-control"
              value={toDate}
               placeholder=" "
                autoComplete="off"
              onChange={(e) => settoDate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
            <label className="exp-form-labels">To Date</label>
          </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedLeave ? "has-value" : ""} 
              ${isSearchLeave ? "is-focused" : ""}`}
            >
            <Select
              id="LeaveType"
              value={selectedLeave}
              onChange={handleLeaves}
              options={filterOptionLeaves}
              placeholder=" "
                onFocus={() => setIsSearchLeave(true)}
                onBlur={() => setIsSearchLeave(false)}
                classNamePrefix="react-select"
                isClearable
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
            <label className="floating-label">Leave Type</label>
          </div>
          </div>

          <div className="col-md-2">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSearchStatus ? "is-focused" : ""}`}
            >
            <Select
              id="Select_slots"
              value={selectedStatus}
              onChange={handleStatus}
              options={filterOptionStatus}
              placeholder=" "
                onFocus={() => setIsSearchStatus(true)}
                onBlur={() => setIsSearchStatus(false)}
                classNamePrefix="react-select"
                isClearable
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
            <label className="floating-label">Leave Status</label>
          </div>
          </div>

           <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearchItem}>
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

          <div className="col-12">
          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            <AgGridReact
              rowData={leaveRowData}
              columnDefs={leaveColumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              ref={gridRef}
            // onSelectionChanged={handleRowSelected}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
