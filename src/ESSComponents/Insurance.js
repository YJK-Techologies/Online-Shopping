import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import Select from 'react-select'
import FamilyDetails from "./FamilyPopup";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {

  const [familyMembers, setFamilyMembers] = useState([{ relation: 'familyMembers', members: [{ relationName: '', name: '', dob: '', Age: '', aadharNo: '', keyfield: '' }] }]);
  const [employeeID, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [relativedrop, setrelationdrop] = useState([]);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  const [isSelectRelation, setIsSelectRelation] = useState({});
  const [loading, setLoading] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const familyPermissions = permissions
    .filter(permission => permission.screen_type === 'Family')
    .map(permission => permission.permission_type.toLowerCase());


  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const addRow = (relation) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { relationName: '', name: '', dob: '', Age: '', aadharNo: '' }] }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const RelationInputChange = (relation, index, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: item.members.map((member, i) =>
              i === index ? { ...member, [field]: value } : member
            ),
          }
          : item
      )
    );
  };

  const [activeTab, setActiveTab] = useState('Family');
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
        Insurance1();
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

  const handleSave = async () => {

    if (!employeeID) {
      setError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    for (const relationGroup of familyMembers) {
      for (const member of relationGroup.members) {
        if (!member.relationName || !member.name || !member.dob || !member.Age) {
          setError("Please fill all required fields.");
          toast.warning("Error: Missing required fields")

          return;
        }
      }
    }

    const employeeData = familyMembers.flatMap((relationGroup) =>
      relationGroup.members.map((member) => ({
        EmployeeId: employeeID,
        Relation: member.relationName,
        Name: member.name,
        DOB: member.dob,
        AGE: member.Age,
        aadhar_no: member.aadharNo,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode")
      }))
    );
    setLoading(true)

    try {
      const response = await fetch(`${config.apiBaseUrl}/addEmployeeFamily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        toast.success("Data saved successfully");
      } else {
        const error = await response.json();  // This is to handle error message sent from backend
        toast.error(error.message || "Failed to save data");
      }
    } catch (error) {
      toast.error(error.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (relationName, index) => {
    const relationGroup = familyMembers.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.relationName || !member.name || !member.dob || !member.Age) {
      setError(" ");
      return;
    }

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to Delete the data in the row?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeFamily`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyfieldsToDelete: [keyfieldsToDelete] }),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
                onClose: () => window.location.reload(),
              });
            }, 1000);
          } else {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            toast.warning(errorResponse.message, {
            })
          }
        } catch (err) {
          console.error("Error delete data:", err);
          toast.error('Error delete data: ' + err.message, {
          });
        } finally {
      setLoading(false);
    }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleUpdate = async (relationName, index) => {
    const relationGroup = familyMembers.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.relationName || !member.name || !member.dob || !member.Age) {
      setError(" ");
      return;
    }

    const editedData = {
      EmployeeId: employeeID,
      Relation: member.relationName,
      Name: member.name,
      DOB: member.dob,
      AGE: member.Age,
      aadhar_no: member.aadharNo,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to update the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeFamily`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ editedData: [editedData] }),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data updated successfully!", {
                onClose: () => window.location.reload(),
              });
            }, 1000);
          } else {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            toast.warning(errorResponse.message, {
            })
          }
        } catch (err) {
          console.error("Error delete data:", err);
          toast.error('Error delete data: ' + err.message, {
          });
        } finally {
      setLoading(false);
    }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmployeeFamily(employeeID)
    }
  };

  const formatDate = (dateString) => {
    if (typeof dateString === 'string' && dateString) {
      const dateParts = dateString.split('T')[0].split('-');
      if (dateParts.length === 3) {
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      }
    }
    return '';
  };

  const handleEmployeeFamily = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeFamily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), }),
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setIsAcademicDataLoaded(true);
        setShowAsterisk(false);
        const searchData = await response.json();

        const [{ EmployeeId, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const { Relation, Name, DOB, AGE, aadhar_no, keyfield } = item;

          const formattedDOB = formatDate(DOB);

          const memberData = {
            relationName: Relation || "",
            selectRelation: Relation
              ? { value: Relation, label: Relation }
              : null,
            name: Name,
            dob: formattedDOB,
            Age: AGE,
            aadharNo: aadhar_no,
            keyfield: keyfield,
          };

          const existingRelation = acc.find(group => group.relation === Relation);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: Relation,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setFamilyMembers(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setFamilyMembers([
          {
            relation: 'familyMembers',
            members: [{
              relationName: '',
              name: '',
              dob: '',
              Age: '',
              aadharNo: '',
              keyfield: ''
            }]
          }
        ]);
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

  const filteredOptionrelation = relativedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {

    fetch(`${config.apiBaseUrl}/getrelation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setrelationdrop(val));
  }, []);


  const handleChangeRelation = (selectedRelation, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  relationName: selectedRelation
                    ? selectedRelation.value
                    : "",
                  selectRelation: selectedRelation,
                }
                : member
            ),
          }
          : doc
      )
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const [open1, setOpen1] = React.useState(false);

  const handleFamilyDetails = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const familyDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setShowAsterisk(false);
      setIsAcademicDataLoaded(true);
      const [{ employeeId }] = data;

      handleEmployeeFamily(employeeId);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const dob = new Date(selectedDate);

    if (selectedDate > today.toISOString().split("T")[0]) {
      toast.warning("Future dates are not allowed!");
      return;
    }

    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--; // Adjust age if birthday hasn't occurred yet this year
    }

    // Update both DOB and Age
    RelationInputChange(relation, idx, "dob", selectedDate);
    RelationInputChange(relation, idx, "Age", age);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleEmployeeFamily(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
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
      handleEmployeeFamily(employeeId);
    }
  }, [location.state]);

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
                <h1 className="page-title">Family</h1>

               <div className="action-wrapper desktop-actions">
                {saveButtonVisible && ['add', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
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

              <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {saveButtonVisible && ['add', 'all permission'].some(p => familyPermissions.includes(p)) && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}

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
                      id="cno"
                      class="exp-input-field form-control"
                      placeholder=" "
                      autoComplete="off"
                      type="text"
                      value={employeeID}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      maxLength={18}
                      onKeyPress={handleKeyPress}
                    />
                <label for="cno" className={`exp-form-labels ${error && !employeeID ? 'text-danger' : ''}`}>Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
                      <span className="select-add-btn" title="Family Help" onClick={handleFamilyDetails}>
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

            {familyMembers.map((relationGroup, relationIndex) => (
              <div key={relationIndex} className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
                {relationGroup.members.map((member, index) => (
                  <div key={index} className="row g-3">

                    <div className="col-md-1">
                      <div className="inputGroup">
                      <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                      {relationGroup.members.length > 1 && (
                        <button type="button" className="btn btn-danger" onClick={() => deleteRow(relationGroup.relation, index)}>
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    </div>

                    <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
              ${member.selectRelation ? "has-value" : ""} 
               ${isSelectRelation[index] ? "is-focused" : ""}`}
                >
                        <Select
                          placeholder=" "
                    onFocus={() => setIsSelectRelation((prev) => ({ ...prev, [index]: true }))}
                    onBlur={() => setIsSelectRelation((prev) => ({ ...prev, [index]: false }))}
                    classNamePrefix="react-select"
                    isClearable
                          value={member.selectRelation}
                          options={filteredOptionrelation}
                          maxLength={50}
                          onChange={(selectedRelation) =>
                            handleChangeRelation(selectedRelation, relationGroup.relation, index)
                          }
                        />
                        <label for="cno" className={`floating-label ${error && !member.relationName ? 'text-danger' : ''}`}>Relation{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>

                    <div className="col-md-2">
                <div className="inputGroup">
                      <input
                        type="text"
                        className="exp-input-field form-control"
                          placeholder=" "
                    autoComplete="off"
                        value={member.name}
                        pattern="[A-Za-z]+"
                        maxLength={250}
                        // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'name', e.target.value)}
                        onChange={(e) => {
                          const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          RelationInputChange(relationGroup.relation, index, 'name', onlyLetters);
                        }}
                      />
                        <label for="cno" className={`exp-form-labels ${error && !member.name ? 'text-danger' : ''}`}>Name{showAsterisk && <span className="text-danger">*</span>}</label>
                    </div>
                    </div>

                    <div className="col-md-2">
                <div className="inputGroup">
                      <input
                        type="date"
                        className="exp-input-field form-control"
                        placeholder=" "
                    autoComplete="off"
                        value={member.dob}
                        max={new Date().toISOString().split("T")[0]} // Restrict future dates
                        onChange={(e) => handleDateChange(e, relationGroup.relation, index)}
                      />
                        <label for="cno" className={`exp-form-labels ${error && !member.dob ? 'text-danger' : ''}`}>DOB{showAsterisk && <span className="text-danger">*</span>}</label>
                    </div>
                    </div>

                     <div className="col-md-2">
                <div className="inputGroup">
                      <input
                        type="number"
                        className="exp-input-field form-control"
                        value={member.Age}
                       placeholder=" "
                    autoComplete="off"
                        readOnly
                      // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'Age', e.target.value)}
                      />
                         <label for="cno" className={`exp-form-labels ${error && !member.Age ? 'text-danger' : ''}`}>Age{showAsterisk && <span className="text-danger">*</span>}</label>
                   </div>
                   </div>

                    <div className="col-md-2">
                <div className="inputGroup">
                      <input
                        type="number"
                        className="exp-input-field form-control"
                        value={member.aadharNo}
                        maxLength={18}
                        placeholder=" "
                    autoComplete="off"
                        onChange={(e) => RelationInputChange(relationGroup.relation, index, 'aadharNo', e.target.value)}
                      />
                         <label for="cno" class="exp-form-labels">Aadhaar No</label>
                   </div>
                   </div>

                    <div className="col-md-1">
                      {isAcademicDataLoaded && (
                        <div className="inputGroup">
                          {['update', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                          {['delete', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              title="Delete"
                              onClick={() => handleDelete(relationGroup.relation, index)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          <div>
            <FamilyDetails open={open1} handleClose={handleClose} familyDetails={familyDetails} />
          </div>
    </div>
  );
}
export default Input;
