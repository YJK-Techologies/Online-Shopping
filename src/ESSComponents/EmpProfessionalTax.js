import { useState, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from './Tabs.js';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
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
  const [Employee_Salary_From, setEmployee_Salary_From] = useState(0);
  const [Employee_Salary_To, setEmployee_Salary_To] = useState(0);
  const [Taxable_Amount, setTaxable_Amount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [rowData, setRowData] = useState([]);
  const [Empsalaryfrom, setEmpsalaryfrom] = useState(0);
  const [EmpsalaryTo, setEmpsalaryTo] = useState(0);
  const [TaxAMt, setTaxAMt] = useState(0);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Professional Tax");
  const [loading, setLoading] = useState(false);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };


  const Employeecol = [
    {
      headerName: "Actions",
      field: "action",
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
                  onClick={() => handleUpdate(params.data)}
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
      headerName: "Start Year",
      field: "Start_Year",
      filter: 'agTextColumnFilter',
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "End Year",
      field: "End_Year",
      filter: 'agTextColumnFilter',
      sortable: false,
      textAlign: "center",
      filter: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Employee Salary From",
      field: "Employee_Salary_From",
      filter: 'agTextColumnFilter',
      sortable: true,
      filter: true,
      editable: false,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Employee Salary To ",
      field: "Employee_Salary_To",
      filter: 'agTextColumnFilter',
      sortable: true,
      editable: false,
      filter: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Taxable Amount",
      field: "Taxable_Amount",
      sortable: true,
      editable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },
    {
      headerName: "Keyfield",
      field: "Keyfield",
      hide: true
    },
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleInsert = async () => {
    if (
      !Employee_Salary_From ||
      !Employee_Salary_To ||
      !Start_Year ||
      !End_Year ||
      !Taxable_Amount
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    try {
      const response = await fetch(`${config.apiBaseUrl}/addProfessionalTax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Start_Year,
          End_Year,
          Employee_Salary_From,
          Employee_Salary_To,
          Taxable_Amount,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });

      if (response.status === 200) {
        console.log("Data Inserted successfully");
        setTimeout(() => {
          toast.success("Data Inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rowData) => {
    setLoading(true)
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateProfessionalTax`, {
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

  const reloadGridData = () => {
    setRowData([]);
  };

  const handleDelete = async (rowData) => {
    setLoading(true)
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/deleteProfessionalTax`, {
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

  const handleSearch = async () => {
    setLoading(true)
    try {
      const body = {
        Employee_Salary_From: Empsalaryfrom,
        Employee_Salary_To: EmpsalaryTo,
        Taxable_Amount: TaxAMt,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/ProfessionalTaxSC`, {
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
          Employee_Salary_From: matchedItem.Employee_Salary_From,
          Employee_Salary_To: matchedItem.Employee_Salary_To,
          Taxable_Amount: matchedItem.Taxable_Amount,
          Keyfield: matchedItem.Keyfield,
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

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Professional Tax</h1>
          <div className="action-wrapper">
            <div onClick={handleInsert} className="action-icon add">
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
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please Choose the Start Year"
                      value={Start_Year}
                      onChange={(e) => setStart_Year(e.target.value)}
                    />
                      <label for="sname" className={`exp-form-labels ${error && !Start_Year ? 'text-danger' : ''}`}>Start Year<span className="text-danger">*</span></label>
                  </div>
                </div>

          <div className="col-md-3">
            <div className="inputGroup">
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please Choose the End Year"
                      value={End_Year}
                      onChange={(e) => setEnd_Year(e.target.value)}
                    />
                        <label for="sname" className={`exp-form-labels ${error && !End_Year ? 'text-danger' : ''}`}> End Year<span className="text-danger">*</span> </label>
                  </div>
                </div>

          <div className="col-md-3">
            <div className="inputGroup">
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="num"
                      placeholder=""
                      required title="Please Enter the Employee Salary From"
                      value={Employee_Salary_From}
                      onChange={(e) => setEmployee_Salary_From(e.target.value)}
                    />
                        <label for="sname" className={`exp-form-labels ${error && !Employee_Salary_From ? 'text-danger' : ''}`}> Employee Salary From<span className="text-danger">*</span> </label>
                  </div>
                </div>

          <div className="col-md-3">
            <div className="inputGroup">
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Employee Salary To"
                      value={Employee_Salary_To}
                      onChange={(e) => setEmployee_Salary_To(e.target.value)} />
                        <label for="add1" className={`exp-form-labels ${error && !Employee_Salary_To ? 'text-danger' : ''}`}>
                          Employee Salary To<span className="text-danger">*</span>
                        </label>
                  </div>
                </div>

          <div className="col-md-3">
            <div className="inputGroup">
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Taxable Amount"
                      value={Taxable_Amount}
                      onChange={(e) => setTaxable_Amount(e.target.value)}
                      maxLength={250}
                    />
                        <label for="add1" className={`exp-form-labels ${error && !Taxable_Amount ? 'text-danger' : ''}`}>
                          Taxable Amount<span className="text-danger">*</span>
                        </label>
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
                      <input id="status"
                        className="exp-input-field form-control"
                        required title="Please Enter the Employee Salary From"
                        value={Empsalaryfrom}
                        onChange={(e) => setEmpsalaryfrom(Number(e.target.value))}
                        type="text"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                          <label for="add1" class="exp-form-labels"> Employee Salary From </label>
                    </div>
                  </div>

          <div className="col-md-3">
            <div className="inputGroup">
                      <input id="status"
                        className="exp-input-field form-control"
                        type="text"
                        required title="Please Enter the Employee Salary To"
                        value={EmpsalaryTo}
                        onChange={(e) => setEmpsalaryTo(Number(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                          <label for="sname" class="exp-form-labels">
                            Employee Salary To
                          </label>
                    </div>
                  </div>

          <div className="col-md-3">
            <div className="inputGroup">
                      <input id="status"
                        className="exp-input-field form-control"
                        required title="Please Enter the Taxable Amount"
                        value={TaxAMt}
                        onChange={(e) => setTaxAMt(Number(e.target.value))}
                        type="number"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                          <label for="add1" class="exp-form-labels">
                            Taxable Amount
                          </label>
                    </div>
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


      <div className="shadow-lg pt-3 pb-3 bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
        <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                  <AgGridReact
                    columnDefs={Employeecol}
                    rowData={rowData}
                    gridOptions={gridOptions}
                    suppressRowClickSelection={true}
                    onGridReady={(params) => {
                      gridApiRef.current = params.api;
                      gridColumnApiRef.current = params.columnApi;
                    }
                    }
                  />
                </div>
              </div>

    </div>
  );
}
export default Input;
