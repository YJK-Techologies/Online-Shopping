import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [loanAction, setLoanAction] = useState('update'); // Default to 'add'
  const [ApprovedDrop, setApprovedDrop] = useState('');
  const [approveddrop, setapproveddrop] = useState('');
  const [EmployeeId, setEmployeeId] = useState('');
  const [loanID, setLoanID] = useState('');
  const [loanid, setLoanid] = useState('');
  const [ApprovedBy, setApprovedBy] = useState('');
  const [approvedby, setapprovedby] = useState('');
  const [LoanEligibleAmount, setLoanEligibleAmount] = useState('');
  const [EffectiveDate, setEffectiveDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [HowManyMonth, setHowManyMonth] = useState('');
  const [EMIAmount, setEMIAmount] = useState('');
  const [Howmanymonth, setHowmanymonth] = useState('');
  const [selectedApprovedBy, setselectedApprovedBy] = useState('');
  const [selectedapprovedby, setselectedapprovedby] = useState('');
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [EmployeeID, setEmployeeID] = useState('');
  const [Loaneligibleamount, setloanEligibleamount] = useState('');
  const [EffetiveDate, setEffectivedate] = useState('');
  const [Enddate, setEnddate] = useState('');
  const [EMIamount, setEMIamount] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [error, setError] = useState("");
  const [LoanDrop, setLoanDrop] = useState([]);
  const [loandrop, setloandrop] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedloan, setselectedloan] = useState("");
  const [rowData, setRowData] = useState('');
  const [isSelectedloanID, setIsSelectedloanID] = useState(false);
  const [isSelectedABY, setIsSelectABY] = useState(false);
  const [isSelectloanid, setIsSelectloanid] = useState(false);
  const [isSelectapprovedby, setIsSelectapprovedby] = useState(false);
  const [loading, setLoading] = useState(false);


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
      headerName: "Employee Id",
      field: "EmployeeId",
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: "Loan ID",
      field: "loanID",
      filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Approved By",
      field: "ApprovedBy",
      filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Loan Eligible Amount",
      field: "LoanEligibleAmount",
      filter: 'agNumberColumnFilter',
      editable: true,
    },
    {
      headerName: "Effective Date",
      field: "EffetiveDate",
      filter: 'agDateColumnFilter',
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "End Date",
      field: "EndDate",
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "How Many Months",
      field: "HowManyMonth",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "EMI Amount",
      field: "EMIAmount",
      filter: 'agNumberColumnFilter',
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (!EmployeeId || !selectedLoan || !selectedApprovedBy || !LoanEligibleAmount || !EffectiveDate || !EndDate || !HowManyMonth || !EMIAmount) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const data = {
        EmployeeId,
        loanID: selectedLoan,
        ApprovedBy: selectedApprovedBy,
        LoanEligibleAmount: parseFloat(LoanEligibleAmount),
        EffectiveDate,
        EndDate,
        HowManyMonth: parseInt(HowManyMonth, 10),
        EMIAmount: parseFloat(EMIAmount),
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeLoan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        toast.warning(errorResponse.message || "Failed to insert sales data");
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

          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeLoan`, {
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
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };
    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeLoan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend),
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

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLoanID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setLoanDrop(val)
        setloandrop(val)

      });
  }, []);

  const HandleLoan = (selectedLoan) => {
    setLoanID(selectedLoan);
    setSelectedLoan(selectedLoan ? selectedLoan.value : '');
  };

  const filteredOptionloan = loandrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const Handleloan = (selectedloan) => {
    setLoanid(selectedloan);
    setselectedloan(selectedloan ? selectedloan.value : '');
  };

  const filteredOptionLoan = LoanDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getTeamManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        setApprovedDrop(val)
        setapproveddrop(val)
      });
  }, []);

  const HandleApproved = (ApprovedBy) => {
    setApprovedBy(ApprovedBy);
    setselectedApprovedBy(ApprovedBy.value);
  };

  const filteredOptionApproved = Array.isArray(ApprovedDrop)
    ? ApprovedDrop.map((option) => ({
      value: option.manager,
      label: `${option.EmployeeId} - ${option.manager}`,  // Concatenate ApprovedBy and EmployeeId with ' - '
    }))
    : [];

  const handleapproved = (approvedby) => {
    setapprovedby(approvedby);
    setselectedapprovedby(approvedby.value);
  };

  const filteredOptionapproved = Array.isArray(approveddrop)
    ? approveddrop.map((option) => ({
      value: option.manager,
      label: `${option.EmployeeId} - ${option.manager}`,  // Concatenate ApprovedBy and EmployeeId with ' - '
    }))
    : [];

  const handleReload = () => {
    window.location.reload();
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        EmployeeId: EmployeeID,
        loanID: selectedloan,
        ApprovedBy: selectedapprovedby,
        LoanEligibleAmount: Loaneligibleamount,
        EffetiveDate: EffetiveDate,
        EndDate: Enddate,
        HowManyMonth: Howmanymonth,
        EMIAmount: EMIamount,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/LoanSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          EmployeeId: matchedItem.EmployeeId,
          loanID: matchedItem.loanID,
          ApprovedBy: matchedItem.ApprovedBy,
          LoanEligibleAmount: matchedItem.LoanEligibleAmount,
          EffetiveDate: matchedItem.EffetiveDate,
          EndDate: matchedItem.EndDate,
          HowManyMonth: matchedItem.HowManyMonth,
          EMIAmount: matchedItem.EMIAmount,

        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

    const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };


  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Add Loan Details</h1>
          <div className="action-wrapper desktop-actions">
            <div class=" d-flex justify-content-end  me-3">
              {saveButtonVisible && (
                <div className="action-icon add" onClick={handleSave}>
                  <span className="tooltip">save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              )}
              <div className="action-icon print" onClick={handleReload}>
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

              <li className="dropdown-item" onClick={handleReload}>
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
                id="EmployeeId"
                className="exp-input-field form-control p-2"
                type="text"
                placeholder=""
                required title="Please enter the Employee ID"
                value={EmployeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                maxLength={20}
              />
              <label className={` exp-form-labels ${error && !EmployeeId ? 'text-danger' : ''}`}> Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${loanID ? "has-value" : ""} 
              ${isSelectedloanID ? "is-focused" : ""}`}
            >
              <Select
                required
                isClearable
                id="loanID"
                value={loanID}
                onChange={HandleLoan}
                options={filteredOptionLoan}
                maxLength={20}
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectedloanID(true)}
                onBlur={() => setIsSelectedloanID(false)}
              />
              <label className={` floating-label ${error && !selectedLoan ? 'text-danger' : ''}`}>Loan ID{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${ApprovedBy ? "has-value" : ""} 
              ${isSelectedABY ? "is-focused" : ""}`}
            >
              <Select
                id="Approvedby"
                classNamePrefix="react-select"
                isClearable
                placeholder=""
                onFocus={() => setIsSelectABY(true)}
                onBlur={() => setIsSelectABY(false)}
                value={ApprovedBy}
                onChange={HandleApproved}
                options={filteredOptionApproved}
                maxLength={35}
              />
              <label for="sname" className={` floating-label ${error && !selectedApprovedBy ? 'text-danger' : ''}`}>Approved By{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="LoanEligibleAmount"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required title="Please Enter the Loan Eligible Amount"
                value={LoanEligibleAmount}
                onChange={(e) => setLoanEligibleAmount(e.target.value.slice(0, 7))}
                maxLength={30}
              />
              <label className={` exp-form-labels ${error && !LoanEligibleAmount ? 'text-danger' : ''}`}>Loan Eligible Amount{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EffetiveDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the Effective Date"
                value={EffectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !EffectiveDate ? 'text-danger' : ''}`}>Effective Date{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EndDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please Enter the End Date"
                value={EndDate}
                onChange={(e) => setEndDate(e.target.value)}
                maxLength={100}
              />
              <label className={` exp-form-labels ${error && !EndDate ? 'text-danger' : ''}`}>End Date{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="HowManyMonth"
                class="exp-input-field form-control"
                type="number"
                placeholder=""
                required title="Please Enter the How Many Months "
                value={HowManyMonth}
                onChange={(e) => setHowManyMonth(e.target.value.slice(0, 2))}
                max={5}
              />
              <label className={` exp-form-labels  ${error && !EndDate ? 'text-danger' : ''}`}>How Many Months{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EMIAmount"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the EMI Amount"
                value={EMIAmount}
                onChange={(e) => setEMIAmount(e.target.value.slice(0, 6))}
                maxLength={60}
              />
              <label for="add3" className={` exp-form-labels ${error && !EMIAmount ? 'text-danger' : ''}`}>EMI Amount{showAsterisk && <span className="text-danger">*</span>}</label>
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
              <input type="text"
                className="exp-input-field form-control"
                placeholder=""
                required title="Please Enter the Employee ID"
                value={EmployeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label class="exp-form-labels">Employee ID</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${loanid ? "has-value" : ""} 
              ${isSelectloanid ? "is-focused" : ""}`}
            >
              <Select type="text"
                required
                isClearable
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectloanid(true)}
                onBlur={() => setIsSelectloanid(false)}
                value={loanid}
                onChange={Handleloan}
                options={filteredOptionloan}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label class="floating-label">Loan ID</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${approvedby ? "has-value" : ""} 
              ${isSelectapprovedby ? "is-focused" : ""}`}
            >
              <Select type="text"
                required
                isClearable
                classNamePrefix="react-select"
                placeholder=""
                onFocus={() => setIsSelectapprovedby(true)}
                onBlur={() => setIsSelectapprovedby(false)}
                value={approvedby}
                onChange={handleapproved}
                options={filteredOptionapproved}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label className="floating-label">Approved By</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input type="number"
                className="exp-input-field form-control"
                required title="Please Enter the Loan Eligible Amount"
                placeholder=" "
                value={Loaneligibleamount}
                onChange={(e) => setloanEligibleamount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label class="exp-form-labels">Loan Eligible Amount</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                type="date"
                required title="Please Enter the Effective Date"
                className="exp-input-field form-control"
                placeholder=""
                value={EffetiveDate}
                onChange={(e) => setEffectivedate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label class="exp-form-labels">Effetive Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                type="date"
                required title="Please Enter the End Date"
                className="exp-input-field form-control"
                placeholder=""
                value={Enddate}
                onChange={(e) => setEnddate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label class="exp-form-labels">End Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input type="number"
                className="exp-input-field form-control"
                required title="Please Enter the How Many Months "
                placeholder=""
                value={Howmanymonth}
                onChange={(e) => setHowmanymonth(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="cname" class="exp-form-labels">How Many Months</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input type="number"
                className="exp-input-field form-control"
                placeholder=""
                required title="Please Enter the EMI Amount"
                value={EMIamount}
                onChange={(e) => setEMIamount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="cname" class="exp-form-labels">EMI Amount</label>
            </div>
          </div>

          {/* Search + Reload Buttons */}
          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadGridData}>
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
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            paginationAutoPageSize={true}
            gridOptions={gridOptions}
             onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  )
}

export default Input;

