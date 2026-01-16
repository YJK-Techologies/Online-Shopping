import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import AcademicDetails from "./AcademicDetPopup.js";
import PdfPreview from './PdfPreviewHelp'
import LoadingScreen from '../Loading';

const config = require('../Apiconfig');

function Input({ }) {

  const [Academic, setAcademic] = useState([{ relation: 'Academic', members: [{ academicName: '', major: '', institution: '', academicYear: '', document: null, documentUrl: '', keyfield: '' }] }]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [document, setDocument] = useState("");
  const [documentUrl, setDocumentUrl] = useState({});
  const navigate = useNavigate();
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [open, setOpen] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const employeeIdRef = useRef(null);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [loading, setLoading] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const academicPermissions = permissions
    .filter(permission => permission.screen_type === 'AcademicDet')
    .map(permission => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };


  const addRow = (relation) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { academicName: '', major: '', institution: '', academicYear: '', document: null, documentUrl: '', keyfield: '' }] }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const handleSave = async () => {
    if (
      !EmployeeId) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    for (const relationGroup of Academic) {
      for (const member of relationGroup.members) {
        if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
      }
    }

    const employeeData = await Promise.all(


      Academic.flatMap((relationGroup) =>
        relationGroup.members.map(async (member) => {
          if (member.document) {
            // Check if file size exceeds 1MB before proceeding
            const fileSize = member.document.size;
            const maxSize = 1 * 1024 * 1024; // 1MB

            if (fileSize > maxSize) {
              toast.warning('File size exceeds 1MB. Please upload a smaller file.');
              return; // Exit early if file is too large
            }

            const fileBase64 = member.document ? await convertToBase64(member.document) : null;
            console.log(fileBase64)
            return {
              EmployeeId: EmployeeId,
              academicName: member.academicName,
              major: member.major,
              institution: member.institution,
              academicYear: member.academicYear,
              document: fileBase64,
              company_code: sessionStorage.getItem("selectedCompanyCode"),
              created_by: sessionStorage.getItem("selectedUserCode"),
            };
          }
        })
      )

    );
    setLoading(true)

    try {
      const response = await fetch(`${config.apiBaseUrl}/addEmployeeAcademicDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        setTimeout(() => {
          toast.success("Data saved successfully!", {
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
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAcademic(EmployeeId)
    }
  };

  // const formatDate = (dateString) => {
  //   if (typeof dateString === 'string' && dateString) {
  //     const dateParts = dateString.split('T')[0].split('-');
  //     if (dateParts.length === 3) {
  //       return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  //     }
  //   }
  //   return '';
  // };

  const convertBufferToBlobUrlAndFile = (buffer, fileName = "document.pdf", mimeType = "application/pdf") => {
    if (buffer && buffer.type === "Buffer") {
      const byteArray = new Uint8Array(buffer.data);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], fileName, { type: mimeType });
      return { blobUrl, file };
    }
    return { blobUrl: null, file: null };
  };

  const handleAcademic = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAcademicDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        setSaveButtonVisible(false);
        setShowAsterisk(false);
        setIsAcademicDataLoaded(true);
        const [{ EmployeeId, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const { academicName, academicYear, document, institution, keyfield, major } = item;

          console.log(document)
          const formattedDOB = formatDate(academicYear);

          let documentUrl = null;
          let documentFile = null;

          if (document) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          const memberData = {
            academicName: academicName,
            major: major,
            institution: institution,
            academicYear: formattedDOB,
            keyfield: keyfield,
            documentUrl: documentUrl,
            document: documentFile
          };

          const existingRelation = acc.find(group => group.relation === academicName);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: academicName,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setAcademic(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setAcademic([
          {
            relation: 'Academic',
            members: [{
              academicName: '',
              major: '',
              institution: '',
              academicYear: '',
              document: null,
              documentUrl: '',
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

  const RelationInputChange = (relation, index, field, value) => {
    setAcademic((prev) =>
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




  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);

      setAcademic((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.relation === relation
            ? {
              ...doc,
              members: doc.members.map((member, i) =>
                i === index
                  ? {
                    ...member,
                    document: file,
                    documentUrl: fileUrl,
                  }
                  : member
              ),
            }
            : doc
        )
      );

      setDocumentUrl((prev) => ({
        ...prev,
        [index]: fileUrl,
      }));
    } else {
      toast.warning('Please upload a valid PDF file.');
      event.target.value = '';
    }
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

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const [activeTab, setActiveTab] = useState('Academic Details');
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

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleUpdate = async (relationName, index) => {
    const relationGroup = Academic.find(group => group.relation === relationName);
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

    if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const editedData = {
      EmployeeId: EmployeeId,
      academicName: member.academicName,
      major: member.major,
      institution: member.institution,
      academicYear: member.academicYear,
      document: fileBase64,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    try {
      const response = await fetch(`${config.apiBaseUrl}/updateEmployeeAcademicDetails`, {
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
  };

  const handleDelete = async (relationName, index) => {
    const relationGroup = Academic.find(group => group.relation === relationName);
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

    if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    try {
      const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeAcademicDetails`, {
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAcademicDetails = () => {
    setOpen(true);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //base64 to pdf conversion (url + file)
  // const convertBase64ToBlobUrlAndFile = (base64, fileName = "document.pdf", mimeType = "application/pdf") => {
  //   if (base64) {
  //     const byteCharacters = atob(base64); 
  //     const byteArrays = new Uint8Array(byteCharacters.length);

  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteArrays[i] = byteCharacters.charCodeAt(i);
  //     }

  //     const blob = new Blob([byteArrays], { type: mimeType });
  //     const blobUrl = URL.createObjectURL(blob);
  //     const file = new File([blob], fileName, { type: mimeType });

  //     return { blobUrl, file };
  //   }
  //   return { blobUrl: null, file: null };
  // };

  // const academicDetails = async (data) => {
  //   if (data && data.length > 0) {
  //     setSaveButtonVisible(false);
  //     setIsAcademicDataLoaded(true);
  //     const [{ employeeId }] = data;

  //     if (employeeIdRef.current) {
  //       employeeIdRef.current.value = employeeId;
  //       setEmployeeId(employeeId);
  //     } else {
  //       console.error('EmployeeId input not found');
  //     }

  //     const updatedMembers = data.map((item) => {
  //       const { blobUrl, file } = convertBase64ToBlobUrlAndFile(item.document);

  //       return {
  //         academicName: item.academicName,
  //         major: item.major,
  //         institution: item.institution,
  //         academicYear: formatDate(item.academicYear),
  //         document: file,
  //         documentUrl: blobUrl, 
  //         keyfield: item.keyfield || ''
  //       };
  //     });

  //     setAcademic([{ relation: 'Academic', members: updatedMembers }]);
  //     console.log(data);
  //   } else {
  //     console.log("Data not fetched...!");
  //   }
  // };

  const academicDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setShowAsterisk(false);
      setIsAcademicDataLoaded(true);
      const [{ employeeId }] = data;

      handleAcademic(employeeId);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = new Date(e.target.value); // Convert to Date object
    const today = new Date(); // Get today's date

    if (selectedDate > today) {
      toast.warning("Future dates are not allowed!");
    } else {
      RelationInputChange(relation, idx, 'academicYear', e.target.value);
    }
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);

      const [{ EmployeeId }] = data;

      console.log(data);

      if (EmployeeId) {
        // ? Just set the value in state
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId not found');
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
  //       handleAcademic(location.state.employeeId); // ✅ Automatically run function
  //     }

  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }

  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     } else {
  //       console.log("Department data not found");
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
      handleAcademic(employeeId);
    }
  }, [location.state]);


  const handleRemovePdf = (relation, index) => {
    setAcademic(prev =>
      prev.map(doc =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((m, i) =>
              i === index
                ? { ...m, document: null, documentUrl: "" }
                : m
            )
          }
          : doc
      )
    );
  };


  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-body-tertiary rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Academic Details</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
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

              {saveButtonVisible && ['add', 'all permission'].some(p => academicPermissions.includes(p)) && (
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
                id="employeeId"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                required
                value={EmployeeId}
                ref={employeeIdRef}
                onChange={(e) => setEmployeeId(e.target.value)}
                maxLength={18}
                onKeyPress={handleKeyPress}
                autoComplete="off"
              />
              <label for="cno" className={`exp-form-labels ${error && !EmployeeId ? 'text-danger' : ''}`}>Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
              <span className="select-add-btn" title="Academic Details Help" onClick={handleAcademicDetails}>
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

      {Academic.map((relationGroup, relationIndex) => (
        <div key={relationIndex} className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">

              <div className="col-md-1">
                <div className="inputGroup">
                  <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  {relationGroup.members.length > 1 && (
                    <button type="button" className="btn btn-danger"
                      onClick={() => deleteRow(relationGroup.relation, index)}>
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    value={member.academicName}
                    placeholder=" "
                    autoComplete="off"
                    maxLength={50}
                    onChange={(e) => RelationInputChange(relationGroup.relation, index, 'academicName', e.target.value)}
                  />
                  <label className={`exp-form-labels ${error && !member.academicName ? 'text-danger' : ''}`}>Academic Name{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    value={member.major}
                    maxLength={125}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) => RelationInputChange(relationGroup.relation, index, 'major', e.target.value)}
                  />
                  <label className={`exp-form-labels ${error && !member.major ? 'text-danger' : ''}`}>Major{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    type="text"
                    className="exp-input-field form-control"
                    value={member.institution}
                    maxLength={225}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) => RelationInputChange(relationGroup.relation, index, 'institution', e.target.value)}
                  />
                  <label className={`exp-form-labels ${error && !member.institution ? 'text-danger' : ''}`}>Institution{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <input
                    id="fdate"
                    class="exp-input-field form-control"
                    type="date"
                    placeholder=" "
                    autoComplete="off"
                    // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'academicYear', e.target.value)}
                    value={member.academicYear}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    onChange={(e) => handleDateChange(e, relationGroup.relation, index)}
                  />
                  <label for="add1" className={`exp-form-labels ${error && !member.relationName ? 'text-danger' : ''}`}>Academic Year{showAsterisk && <span className="text-danger">*</span>}</label>
                </div>
              </div>

              <div className="col-md-2">
                <div className="inputGroup">
                  <div className="image-upload-container">

                    {member.documentUrl ? (
                      <div
                        className="image-preview-box"
                        onClick={() => handlePdfClick(member.documentUrl)}
                      >
                        <iframe
                          src={member.documentUrl}
                          title="PDF Preview"
                          className="pdf-inline-preview"
                        ></iframe>

                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePdf(relationGroup.relation, index);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder-box">
                        <div className="upload-icon-text">
                          <i className="fa-solid fa-file-arrow-up upload-icon me-1"></i>
                          <span>Upload Document</span>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      id={`upload-${index}`}
                      className={`hidden-file-input 
                      ${member.documentUrl ? "disable-overlay" : ""}`}
                      accept="application/pdf"
                      onChange={(event) =>
                        handleFileChange(event, relationGroup.relation, index)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-1 ">
                {isAcademicDataLoaded && (
                  <div className="inputGroup">
                    {['update', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
                      <button
                        type="button"
                        className="btn btn-success"
                        title="Update"
                        onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                      </button>
                    )}
                    {['delete', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
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
        <PdfPreview open={isModalOpen} pdfUrl={currentPdfUrl} handleClose={handleCloseModal} />
        <AcademicDetails open={open} handleClose={handleClose} academicDetails={academicDetails} />
      </div>
    </div>
  );
}
export default Input;
