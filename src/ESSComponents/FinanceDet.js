import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import Select from 'react-select'
import { useNavigate, useLocation } from "react-router-dom";
import FinancialDetails from "./FinanceDetPopup";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [payscale, setPayscale] = useState("");
  const [PFNo, setPFNo] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");
  const [error, setError] = useState("");
  const [salaryTypeDrop, setSalaryTypeDrop] = useState([]);
  const [PayscaleDrop, setPayscaleDrop] = useState([]);
  const [selectedSalaryType, setSelectedSalaryType] = useState('');
  const [selectedPayscale, setselectedPayscale] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  const [isSelectSalary, setIsSelectSalary] = useState(false);
  const [isSelectPayscale, setIsSelectPayscale] = useState(false);
  const [loading, setLoading] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const financePermissions = permissions
    .filter(permission => permission.screen_type === 'FinanceDet')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSalaryType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSalaryTypeDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getPayscale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setPayscaleDrop(val));
  }, []);

  const filteredOptionSalaryType = salaryTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPayscale = PayscaleDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeSalaryType = (selectedSalaryType) => {
    setSelectedSalaryType(selectedSalaryType);
    setSalaryType(selectedSalaryType ? selectedSalaryType.value : '');
  };

  const handleChangePayscale = (selectedPayscale) => {
    setselectedPayscale(selectedPayscale);
    setPayscale(selectedPayscale ? selectedPayscale.value : '');
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const [activeTab, setActiveTab] = useState('Financial Details');
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case 'Personal Details':
        EmployeeLoan();
        break;
      case 'Company Details':
        NavigatecomDet();
        break;
      case 'Financial Details':
        FinanceDet();
        break;
      case 'Bank Account Details':
        BankAccDet();
        break;
      case 'Identity Documents':
        IdentDoc();
        break;
      case 'Academic Details':
        AcademicDet();
        break;
      case 'Family':
        Insurance();
        break;
      case 'Documents':
        Documents();
        break;
      default:
        break;
    }
  };

  const tabs = [
    { label: 'Personal Details' },
    { label: 'Company Details' },
    { label: 'Financial Details' },
    { label: 'Bank Account Details' },
    { label: 'Identity Documents' },
    { label: 'Academic Details' },
    { label: 'Family' },
    { label: 'Documents' }
  ];

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } = location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);
      setFirst_Name(firstName || "");
      setdepartment_id(department_id || "");
      setdesignation_id(designation_id || "");
    }

    if (
      employeeId &&
      salaryTypeDrop?.length > 0 &&
      PayscaleDrop?.length > 0
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, salaryTypeDrop, PayscaleDrop]);

  const handleSave = async () => {
    if (!EmployeeId || !salaryType || !payscale || !PFNo || !salaryMonth) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    try {
      const Header = {
        EmployeeId: EmployeeId,
        salaryType: salaryType,
        Payscale: payscale,
        PFNo: PFNo,
        salary_month: salaryMonth,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addSalaryDetails`, {
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
           // onClose: () => window.location.reload(),
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeSalary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setUpdateButtonVisible(true);
        setShowAsterisk(false);
        const searchData = await response.json();
        const [{ EmployeeId, PFNo, department_id, First_Name, designation_id, Payscale, salaryType, salary_month }] = searchData;

        setEmployeeId(EmployeeId);
        setPFNo(PFNo);
        setSalaryMonth(salary_month);
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const selectedSalaryType = filteredOptionSalaryType.find(option => option.value === salaryType);
        setSelectedSalaryType(selectedSalaryType);
        console.log(selectedSalaryType.value);
        setSalaryType(selectedSalaryType);

        const selectedOptionPayscale = filteredOptionPayscale.find(option => option.value === Payscale);
        setselectedPayscale(selectedOptionPayscale);
        setPayscale(selectedOptionPayscale);

      } else if (response.status === 404) {
        toast.warning('Data not found');
        setSalaryType('');
        setPayscale('');
        setPFNo('');
        setSalaryMonth('');
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!EmployeeId || !PFNo) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to Delete the data ?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            PFNo: PFNo,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/deleteSalaryDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.status === 200) {
            console.log("Data deleted successfully");
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
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
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleUpdate = async () => {
    if (!EmployeeId || !salaryType || !payscale || !PFNo || !salaryMonth) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to update the data ?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            salaryType: salaryType,
            Payscale: payscale,
            PFNo: PFNo,
            salary_month: salaryMonth,
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            modified_by: sessionStorage.getItem('selectedUserCode')
          };

          const response = await fetch(`${config.apiBaseUrl}/updateSalaryDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data updated successfully!", {
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
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const [open, setOpen] = React.useState(false);

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const finaceDetails = async (data) => {

  // 🔴 1. Handle NO DATA case FIRST
  if (!data || data.length === 0) {
    toast.warning("Financial details not found for this employee");

    setSaveButtonVisible(true);
    setUpdateButtonVisible(false);
    setShowAsterisk(true);

    // Clear states if needed
    setEmployeeId("");
    setFirst_Name("");
    setdepartment_id("");
    setdesignation_id("");
    setPFNo("");
    setSalaryMonth("");
    setSalaryType("");
    setPayscale("");
    setSelectedSalaryType(null);
    setselectedPayscale(null);

    return; // 🔥 STOP execution
  }

  // 🔴 2. Data exists
  setSaveButtonVisible(false);
  setUpdateButtonVisible(true);
  setShowAsterisk(false);

  const [{
    employeeId,
    salaryType,
    first_name,
    Department,
    Designation,
    Payscale,
    PFNo,
    salaryMonth
  }] = data;

  console.log("Finance Data:", data);

  // 🔴 3. Employee ID
  const employeeIdRef = document.getElementById("EmployeeId");
  if (employeeIdRef) {
    employeeIdRef.value = employeeId || "";
    setEmployeeId(employeeId || "");
  }

  // 🔴 4. Employee Name
  const firstnameRef = document.getElementById("EmployeelabelName");
  if (firstnameRef) {
    firstnameRef.value = first_name || "";
    setFirst_Name(first_name || "");
  }

  // 🔴 5. Department
  const deptRef = document.getElementById("Departmentlabel");
  if (deptRef) {
    deptRef.value = Department || "";
    setdepartment_id(Department || "");
  }

  // 🔴 6. Designation
  const desigRef = document.getElementById("designationLabel");
  if (desigRef) {
    desigRef.value = Designation || "";
    setdesignation_id(Designation || "");
  }

  // 🔴 7. PF Number
  const pfRef = document.getElementById("PFNo");
  if (pfRef) {
    pfRef.value = PFNo || "";
    setPFNo(PFNo || "");
  }

  // 🔴 8. Salary Month
  const salaryMonthRef = document.getElementById("salaryMonth");
  if (salaryMonthRef) {
    salaryMonthRef.value = salaryMonth || "";
    setSalaryMonth(salaryMonth || "");
  }

  // 🔴 9. Salary Type (SAFE)
  const salaryTypeRef = document.getElementById("salaryType");
  if (salaryTypeRef && salaryType) {
    const selectedSalaryType = filteredOptionSalaryType.find(
      option => option.value === salaryType
    );

    if (selectedSalaryType) {
      setSelectedSalaryType(selectedSalaryType);
      setSalaryType(selectedSalaryType.value);
    } else {
      setSelectedSalaryType(null);
      setSalaryType("");
    }
  }

  // 🔴 10. Payscale (SAFE)
  const payScaleRef = document.getElementById("payScale");
  if (payScaleRef && Payscale) {
    const selectedPayscale = filteredOptionPayscale.find(
      option => option.value === Payscale
    );

    if (selectedPayscale) {
      setselectedPayscale(selectedPayscale);
      setPayscale(selectedPayscale.value);
    } else {
      setselectedPayscale(null);
      setPayscale("");
    }
  }
};


  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numeric values
      setSalaryMonth(value);
    }
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //   }
  // }, [location.state]);




  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Financial Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => financePermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleSave}>
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            {updateButtonVisible && ['update', 'all permission'].some(permission => financePermissions.includes(permission)) && (
              <div className="action-icon update" onClick={handleUpdate}>
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => financePermissions.includes(permission)) && (
              <div className="action-icon delete" onClick={handleDelete}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {saveButtonVisible && ['add', 'all permission'].some(p => financePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}

              {updateButtonVisible && ['update', 'all permission'].some(p => financePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleUpdate}>
                  <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
                </li>
              )}

              {['delete', 'all permission'].some(p => financePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleDelete}>
                  <i className="fa-solid fa-user-minus text-danger fs-4"></i>
                </li>
              )}

              {['all permission', 'reload'].some(p => financePermissions.includes(p)) && (
                <li className="dropdown-item" onClick={reloadGridData}>
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </li>
              )}

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
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                value={EmployeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={18}
                autoComplete="off"
              />
              <label for="cno" className={`exp-form-labels ${error && !EmployeeId ? 'text-danger' : ''}`}>Employee ID<span className="text-danger">*</span> </label>
              <span className="select-add-btn" title="Financial Details Help" onClick={handleEmployeeInfo}>
                <i className="fa fa-search"></i>
              </span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='FirstNamelabel' className="partyName">
                  <strong>Employee Name:</strong> {First_Name}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-2" style={{ marginRight: "20px", }}>
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='Departmentlabel' className="partyName">
                  <strong>Department:</strong> {department_id}
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="exp-form-floating">
              <div className="info-label-container">
                <label id='designationLabel' className="partyName">
                  <strong>Designation:</strong> {designation_id}
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>

      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <div className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedSalaryType ? "has-value" : ""} 
              ${isSelectSalary ? "is-focused" : ""}`}
            >
              <Select
                id="salaryType"
                placeholder=" "
                onFocus={() => setIsSelectSalary(true)}
                onBlur={() => setIsSelectSalary(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedSalaryType}
                onChange={handleChangeSalaryType}
                options={filteredOptionSalaryType}
                maxLength={50}
              />
              <label for="cname" className={`floating-label ${error && !salaryType ? 'text-danger' : ''}`}>Salary Type{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedPayscale ? "has-value" : ""} 
              ${isSelectPayscale ? "is-focused" : ""}`}
            >
              <Select
                id="payScale"
                placeholder=" "
                onFocus={() => setIsSelectPayscale(true)}
                onBlur={() => setIsSelectPayscale(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedPayscale}
                onChange={handleChangePayscale}
                options={filteredOptionPayscale}
                maxLength={50}
              />
              <label for="sname" className={`floating-label ${error && !payscale ? 'text-danger' : ''}`}>Payscale{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                class="exp-input-field form-control"
                type="text"
                id="PFNo"
                placeholder=" "
                autoComplete="off"
                value={PFNo}
                onChange={(e) => setPFNo(e.target.value)}
                maxLength={100}
              />
              <label for="sname" className={`exp-form-labels ${error && !PFNo ? 'text-danger' : ''}`}>PF No<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="salaryMonth"
                className="exp-input-field form-control"
                type="Number"
                placeholder=" "
                autoComplete="off"
                value={salaryMonth}
                onChange={(e) => handleSalaryChange(e)}
                maxLength={17}
              />
              <label htmlFor="sname" className={`exp-form-labels ${error && !salaryMonth ? 'text-danger' : ''}`}>
                Salary Per Annum{showAsterisk && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>

        </div>
      </div>
      <div>
        <FinancialDetails open={open} handleClose={handleClose} finaceDetails={finaceDetails} />
      </div>
    </div>
  );
}
export default Input;
