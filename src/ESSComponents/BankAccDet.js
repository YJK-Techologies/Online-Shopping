import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import Bankaccdetpopup from "./bankaccdetpopup";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [Account_NO, setAccountNumber] = useState('');
  const [IFSC_Code, setIFSCCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [passBookImg, setPassBookImg] = useState('');
  const [selectedImg, setSelectedImage] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const logo = useRef(null)
  const [loading, setLoading] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const bankPermissions = permissions
    .filter(permission => permission.screen_type === 'BankAccDet')
    .map(permission => permission.permission_type.toLowerCase());

  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const [activeTab, setActiveTab] = useState('Bank Account Details');
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning('File size exceeds 1MB. Please upload a smaller file.');
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setPassBookImg(file);
    }
  };

  const handleInsert = async () => {
    if (!EmployeeId || !Account_NO || !AccountHolderName || !bankName || !IFSC_Code) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/Add_employee_bankdetails`, {
        method: "POST",
        body: formData,
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
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!Account_NO) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to Delete the data?",
      async () => {
        try {
          const Header = {
            Account_NO: Account_NO,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/Employeebankdetdelete`, {
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


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const handleRefNo = async (code) => {
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeBankDeatils`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ AccountHolderName, designation_id, department_id, First_Name, Account_NO, EmployeeId, bankName, IFSC_Code, branchName, Bankbook_img }] = searchData;

        setAccountHolderName(AccountHolderName);
        setAccountNumber(Account_NO)
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setEmployeeId(EmployeeId);
        setIFSCCode(IFSC_Code);
        setBankName(bankName);
        setBranchName(branchName);
        setUpdateButtonVisible(true);

        setSaveButtonVisible(false);
        const imageBlob = new Blob([new Uint8Array(Bankbook_img.data)], { type: 'image/jpeg' });

        setPassBookImg(imageBlob);

        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedImage(imageUrl);

      } else if (response.status === 404) {
        toast.warning("Data not found")
        setAccountHolderName('');
        setAccountNumber('');
        setIFSCCode('');
        setBankName('');
        setBranchName('');
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


  const handleUpdate = async () => {
    if (
      !EmployeeId ||
      !Account_NO ||
      !AccountHolderName ||
      !bankName ||
      !branchName ||
      !IFSC_Code

    ) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true)
    // if (!validateEmail(Email)) {
    //   setError("Please enter a valid email address");
    //   return;
    // }
    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("modified_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/updateEmployeebankdet`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data updated successfully");
        setTimeout(() => {
          toast.success("Data updated successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {

      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  }
  const handleBankAccDet = () => {
    setOpen(true);
  };



  const reloadGridData = () => {
    window.location.reload();
  };

  const Employeebankdetails = async (data) => {

    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ EmployeeId, Account_NO, first_name, department_ID, designation_ID, AccountHolderName, IFSC_Code, bankName, branchName }] = data;

      console.log(data);
      setSelectedImage(`data:image/jpeg;base64,${data[0].Bankbook_img}`);

      const employeeId = document.getElementById('EmployeeId');
      if (employeeId) {
        employeeId.value = EmployeeId;
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId  not found');
      }

      const firstname = document.getElementById('EmployeelabelName');
      if (firstname) {
        firstname.value = first_name;
        setFirst_Name(first_name);
      } else {
        console.error('EmployeeId  not found');
      }
      const DPT = document.getElementById('Departmentlabel');
      if (DPT) {
        DPT.value = department_ID;
        setdepartment_id(department_ID);
      } else {
        console.error('EmployeeId  not found');
      }

      const Desig = document.getElementById('designationLabel');
      if (Desig) {
        Desig.value = designation_ID;
        setdesignation_id(designation_ID);
      } else {
        console.error('EmployeeId  not found');
      }


      const accounno = document.getElementById('Account_NO');
      if (accounno) {
        accounno.value = Account_NO;
        setAccountNumber(Account_NO);
      } else {
        console.error('Account_NO not found');
      }

      const accountholder = document.getElementById('AccountHolderName');
      if (accountholder) {
        accountholder.value = AccountHolderName;
        setAccountHolderName(AccountHolderName);
      } else {
        console.error('AccountHolderName not found');
      }
      const IFSCCode = document.getElementById('IFSC_Code');
      if (IFSCCode) {
        IFSCCode.value = IFSC_Code;
        setIFSCCode(IFSC_Code);
      } else {
        console.error('IFSC_Code  not found');
      }
      const bankname = document.getElementById('bankName');
      if (bankname) {
        bankname.value = bankName;
        setBankName(bankName);
      } else {
        console.error('bankName not found');
      }

      const branchname = document.getElementById('branchName');
      if (branchname) {
        branchname.value = branchName;
        setBranchName(branchName);
      } else {
        console.error('branchName not found');
      }

    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ EmployeeId }] = data;

      console.log(data);


      const employeeId = document.getElementById('EmployeeId');
      if (employeeId) {
        employeeId.value = EmployeeId;
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId  not found');
      }




    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId)
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     } else {
  //       console.log("data not found")
  //     }
  //     if (location.state.designation_id) {
  //       setdesignation_id(location.state.designation_id);
  //     }
  //   }
  // }, [location.state]);

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } = location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);
      setFirst_Name(firstName || "");
      setdepartment_id(department_id || "");
      setdesignation_id(designation_id || "");
    }

    if (employeeId) {
      handleRefNo(employeeId);
    }
  }, [location.state]);

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Bank Account Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon add" onClick={handleInsert}>
                <span className="tooltip">save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            {updateButtonVisible && ['update', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon update" onClick={handleUpdate}>
                <span className="tooltip">Update</span>
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            )}
            {['delete', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
              <div className="action-icon delete" onClick={handleDelete}>
                <span className="tooltip">Delete</span>
                <i class="fa-solid fa-trash"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData} title="Reload">
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

            {saveButtonVisible && ['add', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleInsert}>
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>
            )}

            {updateButtonVisible && ['update', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleUpdate}>
                <i className="fa-solid fa-pen-to-square text-primary fs-4"></i>
              </li>
            )}

            {['delete', 'all permission'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={handleDelete}>
                <i className="fa-solid fa-user-minus text-danger fs-4"></i>
              </li>
            )}

            {['all permission', 'reload'].some(p => bankPermissions.includes(p)) && (
              <li className="dropdown-item" onClick={reloadGridData}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </li>
            )}

          </ul>
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
                autoComplete="off"
                value={EmployeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <label for="cno" className={`exp-form-labels ${error && !EmployeeId ? 'text-danger' : ''}`}>Employee ID<span className="text-danger">*</span> </label>
              <span className="select-add-btn" title="Bank Account Details Help" onClick={handleBankAccDet}>
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
            <div className="inputGroup">
              <input
                id="cno"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={AccountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
              <label for="cno" className={`exp-form-labels ${error && !AccountHolderName ? 'text-danger' : ''}`}>Account Holder Name<span className="text-danger">*</span> </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="Account_NO"
                class="exp-input-field form-control"
                type="Number"
                name="Account_NO"
                placeholder=" "
                autoComplete="off"
                value={Account_NO}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <label for="cname" className={`exp-form-labels ${error && !Account_NO ? 'text-danger' : ''}`}>Account Number<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="IFSC_Code"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={IFSC_Code}
                onChange={(e) => setIFSCCode(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !IFSC_Code ? 'text-danger' : ''}`}>IFSC Code<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="bankName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !bankName ? 'text-danger' : ''}`}>Bank Name
                <span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="branchName"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
              <label for="add1" className={`${error && !branchName ? 'text-danger' : ''}`}>Branch Name<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <div className="image-upload-container">
                {selectedImg ? (
                  <div className="image-preview-box">
                    <img
                      src={selectedImg}
                      alt="Uploaded Logo"
                      className="uploaded-image"
                    />
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleRemoveLogo}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder-box">
                    <div className="upload-icon-text">
                      <i className="fa-regular fa-image upload-icon me-1"></i>
                      <span>Upload Bank Passbook</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  id="locno"
                  className="exp-input-field form-control hidden-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={logo}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <Bankaccdetpopup open={open} handleClose={handleClose} Employeebankdetails={Employeebankdetails} />
    </div>
  );
}
export default Input;
