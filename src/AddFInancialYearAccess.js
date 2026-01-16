import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';


function StdAccInput({ }) {
  const navigate = useNavigate();
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [transactiondrop, setTransactiondrop] = useState([]);
  const [TransactionType, setTransactionType] = useState("");
  const [selectedLockType, setSelectedLockType] = useState("");
  const [Lockdrop, setLockdrop] = useState([]);
  const [LockType, setLockType] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfield, setKeyfield] = useState('');
  const [loading, setLoading] = useState(false);
  const [base_accgroup_code, setbase_accgroup_code] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('base');
  const [selectBaseacc, setselectedbaseacc] = useState('');
  const StartYear = useRef(null)
  const EndYear = useRef(null)
  const transactionType = useRef(null)
  const lockType = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const config = require('./Apiconfig');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [isSelectedTransaction, setIsSelectedTransaction] = useState(false);
  const [isSelectedLockType, setIsSelectedLockType] = useState(false);


  console.log(selectedRow);

  console.log(selectedRow);
  const clearInputFields = () => {
    setStartYear("");
    setEndYear("");
    setTransactionType("");
    setLockType("");

  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      if (selectedRow.start_year) {
        const formattedStartYear = new Date(selectedRow.start_year).toISOString().split("T")[0];
        setStartYear(formattedStartYear);
      } else {
        setStartYear("");
      }

      if (selectedRow.end_year) {
        const formattedEndYear = new Date(selectedRow.end_year).toISOString().split("T")[0];
        setEndYear(formattedEndYear);
      } else {
        setEndYear("");
      }
      setTransactionType(selectedRow.transaction_type || "");
      setLockType(selectedRow.locked || "");
      setKeyfield(selectedRow.keyfield || "");

      setSelectedTransaction({
        label: selectedRow.transaction_type,
        value: selectedRow.transaction_type,
      });
      setSelectedLockType({
        label: selectedRow.locked,
        value: selectedRow.locked,
      });


    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const getFinancialYearDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
    console.log(currentMonth)
    let startYear, endYear;

    if (currentMonth < 4) {
      // Jan, Feb, Mar ? current FY started last year
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      // Apr to Dec ? FY starts this year
      startYear = currentYear;
      endYear = currentYear + 1;
    }

    const FirstDate = `${startYear}-04-01`;
    const LastDate = `${endYear}-03-31`;

    return { FirstDate, LastDate };
  };
  const { FirstDate, LastDate } = getFinancialYearDates();


  const handleChangeTransaction = (selectedTransaction) => {
    setSelectedTransaction(selectedTransaction);
    setTransactionType(selectedTransaction ? selectedTransaction.value : '');
  };
  const filteredOptionTransaction = transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTransactiondrop(val));
  }, []);

  const handleChangeLockType = (selectedLockType) => {
    setSelectedLockType(selectedLockType);
    setLockType(selectedLockType ? selectedLockType.value : '');
  };
  const filteredOptionLockType = Lockdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getLockType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setLockdrop(val));
  }, []);



  //  useEffect(() => {
  //    const company_code = sessionStorage.getItem('selectedCompanyCode');

  //    fetch(`${config.apiBaseUrl}/status`, {
  //      method: 'POST',
  //      headers: {
  //        'Content-Type': 'application/json',
  //      },
  //      body: JSON.stringify({ company_code })
  //    })
  //      .then((data) => data.json())
  //      .then((val) => setStatusdrop(val))
  //      .catch((error) => console.error('Error fetching data:', error));
  //  }, []);


  //  useEffect(() => {
  //    fetch(`${config.apiBaseUrl}/getbasaccode`)
  //      .then((data) => data.json())
  //      .then((val) => setbaseaccdrop(val));
  //  }, []);


  // //  useEffect(() => {
  // //    const company_code = sessionStorage.getItem('selectedCompanyCode');

  // //    fetch(`${config.apiBaseUrl}/delPer`, {
  // //      method: 'POST',
  // //      headers: {
  // //        'Content-Type': 'application/json',
  // //      },
  // //      body: JSON.stringify({ company_code })
  // //    })
  // //      .then((data) => data.json())
  // //      .then((val) => setdeletedrop(val))
  // //      .catch((error) => console.error('Error fetching data:', error));
  // //  }, []);


  // //  const filteredOptionbaseacc = baseaccdrop.map((option) => ({
  // //    value: option.base_accgroup_code,
  // //    label: option.base_accgroup_code,
  // //  }));

  // //  const filteredOptionStatus = statusdrop.map((option) => ({
  // //    value: option.attributedetails_name,
  // //    label: option.attributedetails_name,
  // //  }));

  // //  const filteredOptionDelete = Array.isArray(deletedrop) ? deletedrop.map((option) => ({
  // //    value: option.attributedetails_name,
  // //    label: option.attributedetails_name,
  // //  })) : [];


  // //  const handleChangeStatus = (selectedStatus) => {
  // //    setSelectedStatus(selectedStatus);
  // //    setstatus(selectedStatus ? selectedStatus.value : '');
  // //    setError(false);
  // //  };

  // //  const handleChangebaseacc = (selectedbaseacc) => {
  // //    setselectedbaseacc(selectedbaseacc);
  // //    setbase_accgroup_code(selectedbaseacc ? selectedbaseacc.value : '');
  // //    setError(false);
  // //  };

  // //  const handleChangeDelete = (selectedDelete) => {
  // //    setSelectedDelete(selectedDelete);
  // //    setdeletePermission(selectedDelete ? selectedDelete.value : '');
  // //    setError(false);
  //  //};

  const handleNavigateToForm = () => {
    navigate("/AddBaseAccount", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !startYear ||
      !endYear ||
      !TransactionType ||
      !LockType
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    const start = new Date(startYear);
    const end = new Date(endYear);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.warning("Please enter valid date values for Start Year and End Year.");
      return;
    }

    if (start > end) {
      toast.warning("Start Year cannot be greater than End Year.");
      return;
    }
    //   if (validateInputs()) {
    try {

      const response = await fetch(`${config.apiBaseUrl}/AddFinacnialyearlockscreen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          start_year: startYear,
          end_year: endYear,
          transaction_type: TransactionType,
          locked: LockType,
          created_by: sessionStorage.getItem('selectedUserCode')

        }),
      });
      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message)

      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Failed to insert data')
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message)
    }
  };

  const handleUpdate = async () => {
    if (
      !startYear ||
      !endYear ||
      !TransactionType ||
      !LockType
    )
      // {
      //     setError(" ");

      //     return;
      //   }
      setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/UpdateFinacnialyearlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          start_year: startYear,
          end_year: endYear,
          transaction_type: TransactionType,
          locked: LockType,
          modified_by: sessionStorage.getItem("selectedUserCode"),
          keyfield
        }),
      });
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });

      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };




  const handleNavigate = () => {
    navigate("/FinancialYearAccess");
  };


  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };
  return (

    <div class="container-fluid Topnav-screen ">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">{mode === "update" ? 'Update Financial Year Access' : 'Add Financial Year Access'}</h1>
          <div className="action-wrapper">
            <div className="action-icon delete" onClick={handleNavigate}>
              <span className="tooltip">Close</span>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="stdcode"
                class="exp-input-field form-control"
                type="Date"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                ref={StartYear}
                onKeyDown={(e) => handleKeyDown(e, EndYear, StartYear)}
              />
              <label className={`exp-form-labels ${error && !startYear ? 'text-danger' : ''}`}>Start Year <span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="stdname"
                class="exp-input-field form-control"
                type="Date"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                ref={EndYear}
                onKeyDown={(e) => handleKeyDown(e, transactionType, EndYear)}
              />
              <label className={`exp-form-labels ${error && !endYear ? 'text-danger' : ''}`}>End Year <span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedTransaction ? "has-value" : ""} 
              ${isSelectedTransaction ? "is-focused" : ""}`}
            >
              <Select
                id="taxtransaction"
                type="text"
                value={selectedTransaction}
                onChange={handleChangeTransaction}
                options={filteredOptionTransaction}
                ref={transactionType}
                placeholder=" "
                onFocus={() => setIsSelectedTransaction(true)}
                onBlur={() => setIsSelectedTransaction(false)}
                classNamePrefix="react-select"
                isClearable
                onKeyDown={(e) => handleKeyDown(e, lockType, transactionType)}
              />
              <label className={`floating-label ${error && !selectedTransaction ? 'text-danger' : ''}`}>Transaction Type<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedLockType ? "has-value" : ""} 
              ${isSelectedLockType ? "is-focused" : ""}`}
            >
              <Select
                class="exp-input-field"
                value={selectedLockType}
                onChange={handleChangeLockType}
                options={filteredOptionLockType}
                placeholder=" "
                onFocus={() => setIsSelectedLockType(true)}
                onBlur={() => setIsSelectedLockType(false)}
                classNamePrefix="react-select"
                isClearable
                ref={lockType}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (mode === "create") {
                      handleInsert();
                    } else {
                      handleUpdate();
                    }
                  }
                }}
              />
              <label className={`floating-label ${error && !base_accgroup_code ? 'text-danger' : ''}`}>Locked<span className="text-danger">*</span></label>
            </div>
          </div>

          <div class="col-12">
            <div className="search-btn-wrapper">
              {mode === "create" ? (
                <div className="icon-btn save" onClick={handleInsert}>
                  <span className="tooltip">Save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              ) : (
                <div className="icon-btn update" onClick={handleUpdate}>
                  <span className="tooltip">Update</span>
                  <i class="fa-solid fa-pen-to-square"></i>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>


    </div>

  );
}
export default StdAccInput;