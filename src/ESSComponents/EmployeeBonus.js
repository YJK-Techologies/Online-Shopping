import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import TabButtons from './Tabs.js';
import Select from 'react-select';
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based

  let startYear, endYear;

  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {
    startYear = currentYear;
    endYear = currentYear + 1;
  }

  const FirstDate = `${startYear}-04-01`;
  const LastDate = `${endYear}-03-31`;

  return { FirstDate, LastDate };
};

const { FirstDate, LastDate } = getFinancialYearDates();

function Input({ }) {

  const [rowData, setRowData] = useState([]);
  const [annualBonus, setAnnualBonus] = useState("");
  const [referralBonus, setReferralBonus] = useState("");
  const [retentionBonus, setRetentionBonus] = useState("");
  const [holidayBonus, setHolidayBonus] = useState("");
  const [performanceBonus, setPerformanceBonus] = useState("");
  const [discretionaryBonus, setDiscretionaryBonus] = useState("");
  const [startYear, setStartYear] = useState(FirstDate);
  const [endYear, setEndYear] = useState(LastDate);
  const [error, setError] = useState("");
  const [IDdrop, setIDdrop] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [grade, setGrade] = useState("");
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [Annual_bonus, setAnnual_bonus] = useState(0);
  const [Referral_bonus, setReferral_bonus] = useState(0);
  const [activeTab, setActiveTab] = useState("Bonus")
  const [isSelectedGrade, setIsSelectedGrade] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIDdrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error('Error fetching gender data:', error);
      });
  }, []);

  const filteredOptionGrade = Array.isArray(IDdrop)
    ? IDdrop.map((option) => ({
      value: option.GradeID,
      label: option.GradeID,
    }))
    : [];

  const handleChangeGrade = (selectedGrade) => {
    setSelectedGrade(selectedGrade);
    setGrade(selectedGrade ? selectedGrade.value : '');
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
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
      headerName: "Start Year", field: "Start_Year",
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
      headerName: "End Year", field: "End_Year",
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
      headerName: "Grade ID",
      field: "GradeID",
      editable: true
    },
    {
      headerName: "Annual Bonus",
      field: "Annual_bonus",
      editable: true
    },
    {
      headerName: "Referral Bonus",
      field: "Referral_bonus",
      editable: true
    },
    {
      headerName: "Retention Bonus",
      field: "Retention_bonus",
      editable: true
    },
    {
      headerName: "Holiday Bonus",
      field: "Holiday_bonus",
      editable: true
    },
    {
      headerName: "Performance Bonus",
      field: "Performance_bonus",
      editable: true
    },
    {
      headerName: "Discretionary Bonus",
      field: "Discretionary_bonus",
      editable: true
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true
    },
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (!annualBonus || !referralBonus || !retentionBonus || !holidayBonus || !performanceBonus || !discretionaryBonus || !startYear || !endYear) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const Header = {
        GradeID: grade,
        Annual_bonus: annualBonus,
        Referral_bonus: referralBonus,
        Retention_bonus: retentionBonus,
        Holiday_bonus: holidayBonus,
        Performance_bonus: performanceBonus,
        Discretionary_bonus: discretionaryBonus,
        Start_Year: startYear,
        End_Year: endYear,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };
      const response = await fetch(`${config.apiBaseUrl}/AddBonusDetails`, {
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        Annual_bonus,
        Referral_bonus,
        Start_Year,
        End_Year,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/BonusDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          Start_Year: formatDate(matchedItem.Start_Year),
          End_Year: formatDate(matchedItem.End_Year),
          GradeID: matchedItem.GradeID,
          Annual_bonus: matchedItem.Annual_bonus,
          Referral_bonus: matchedItem.Referral_bonus,
          Retention_bonus: matchedItem.Retention_bonus,
          Holiday_bonus: matchedItem.Holiday_bonus,
          Performance_bonus: matchedItem.Performance_bonus,
          Discretionary_bonus: matchedItem.Discretionary_bonus,
          keyfield: matchedItem.keyfield,
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
      toast.error("Error fetching search data:", error);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/UpdBonusDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(),
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

  const handleDelete = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/DelBonusDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
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
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const tabs = [
    { label: 'Salary Eligibility Days' },
    { label: 'Bonus' },
    { label: 'PF Contribution' },
    { label: 'Professional Tax' },
    { label: 'Loan Type' },
    { label: 'TDS' },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case 'EmployeeAllowance':
        NavigateEmployeeAllowance();
        break;
      case 'Salary Eligibility Days':
        FinancialYear();
        break;
      case 'Bonus':
        EmployeeBonus();
        break;
      case 'PF Contribution':
        EmpPFCompany();
        break;
      case 'Professional Tax':
        EmpProfessionalTax();
        break;
      case 'Loan Type':
        EmpLoanType();
        break;
      case 'TDS':
        EmpTDS();
        break;
      default:
        break;
    }
  };

  const NavigateEmployeeAllowance = () => {
    navigate("/EmployeeAllowance");
  };

  const FinancialYear = () => {
    navigate("/PayslipSalaryDays");
  };

  const EmployeeBonus = () => {
    navigate("/PayslipEmpBonus");
  };

  const EmpPFCompany = () => {
    navigate("/PFContribution");
  };

  const EmpProfessionalTax = () => {
    navigate("/PayslipEmpProTax");
  };

  const EmpLoanType = () => {
    navigate("/PayslipEmpLoanType");
  };

  const EmpTDS = () => {
    navigate("/PayslipEmpTDS");
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Bonus</h1>
          <div className="action-wrapper">
            <div onClick={handleSave} className="action-icon add">
              <span className="tooltip">Save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
          </div>
        </div>
      </div>
      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the Start Year"
                autoComplete="off"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              />
              <label For="city" className={` exp-form-labels ${error && !startYear ? 'text-danger' : ''}`}>Start Year<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the End Year"
                autoComplete="off"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
              />
              <label For="city" className={` exp-form-labels ${error && !endYear ? 'text-danger' : ''}`}>End Year<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedGrade ? "has-value" : ""} 
              ${isSelectedGrade ? "is-focused" : ""}`}
            >
              <Select
                id="gradeid"
                placeholder=" "
                onFocus={() => setIsSelectedGrade(true)}
                onBlur={() => setIsSelectedGrade(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedGrade}
                onChange={handleChangeGrade}
                options={filteredOptionGrade}
              />
              <label className={`floating-label ${error && !grade ? 'text-danger' : ''}`}>Grade ID<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Annual Bonus"
                autoComplete="off"
                value={annualBonus}
                onChange={(e) => setAnnualBonus(Number(e.target.value))}
              />
              <label for="sname" className={`${error && !annualBonus ? 'text-danger' : ''}`}>Annual Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Referral Bonus"
                autoComplete="off"
                value={referralBonus}
                onChange={(e) => setReferralBonus(Number(e.target.value))}
              />
              <label for="add1" className={`${error && !referralBonus ? 'text-danger' : ''}`}>Referral Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Retention Bonus"
                autoComplete="off"
                value={retentionBonus}
                onChange={(e) => setRetentionBonus(Number(e.target.value))}
              />
              <label for="add1" className={`${error && !retentionBonus ? 'text-danger' : ''}`}>Retention Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add2"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Holiday Bonus"
                autoComplete="off"
                value={holidayBonus}
                onChange={(e) => setHolidayBonus(Number(e.target.value))}
              />
              <label for="add2" className={`${error && !holidayBonus ? 'text-danger' : ''}`}>Holiday Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Performance Bonus"
                autoComplete="off"
                value={performanceBonus}
                onChange={(e) => setPerformanceBonus(Number(e.target.value))}
              />
              <label for="add3" className={`${error && !performanceBonus ? 'text-danger' : ''}`}>Performance Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Discretionary Bonus"
                autoComplete="off"
                value={discretionaryBonus}
                onChange={(e) => setDiscretionaryBonus(Number(e.target.value))}
              />
              <label For="city" className={`${error && !discretionaryBonus ? 'text-danger' : ''}`}>Discretionary Bonus<span className="text-danger">*</span></label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h6 className="">Search Criteria:</h6>
        </div>
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the Year"
                autoComplete="off"
                value={Start_Year}
                onChange={(e) => setStart_Year(e.target.value)}
              />
              <label For="city">Start Year</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="add3"
                class="exp-input-field form-control"
                type="Date"
                placeholder=""
                required title="Please Choose the Year"
                autoComplete="off"
                value={End_Year}
                onChange={(e) => setEnd_Year(e.target.value)}
              />
              <label For="city">End Year</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please enter the Annual Bonus"
                autoComplete="off"
                value={Annual_bonus}
                onChange={(e) => setAnnual_bonus(Number(e.target.value))}
              />
              <label for="sname">Annual Bonus</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please enter the Referral Bonus"
                autoComplete="off"
                value={Referral_bonus}
                onChange={(e) => setReferral_bonus(Number(e.target.value))}
              />
              <label for="add1">Referral Bonus</label>
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
            />
          </div>
        </div>


    </div>
  );
}
export default Input;
