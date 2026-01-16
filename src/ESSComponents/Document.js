import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import TabButtons from "./Tabs";
import PdfPreview from './PdfPreviewHelp';
import Select from 'react-select';
import DocumentPopup from "./DocumentPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([{ relation: 'documents', members: [{ documentName: '', document: null, documentUrl: '' }] }]);
  const [documentNameDrop, setDocumentNameDrop] = useState([]);
  const [documentUrl, setDocumentUrl] = useState({});
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  const [isSelectDocument, setIsSelectDocument] = useState({});
  const [loading, setLoading] = useState(false);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const documentsPermissions = permissions
    .filter(permission => permission.screen_type === 'Documents')
    .map(permission => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const [activeTab, setActiveTab] = useState('Documents');
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    if (!employeeId) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    for (const relationGroup of documents) {
      for (const member of relationGroup.members) {
        if (!member.documentName || !member.document) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
      }
    }

    const employeeData = await Promise.all(
      documents.flatMap((relationGroup) =>
        relationGroup.members.map(async (member) => {
          const fileBase64 = member.document ? await convertToBase64(member.document) : null;
          console.log(fileBase64)
          return {
            EmployeeId: employeeId,
            document_name: member.documentName,
            document_files: fileBase64,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          };
        })
      )
    );
    setLoading(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddEmpDoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        toast.success("Data saved successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save data");
      }
    } catch (error) {
      toast.error(error.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async () => {
  //   if (
  //     !employeeId) {
  //     setError("Please fill all required fields.");
  //     return;
  //   }

  //   try {
  //     const deatils = {
  //       EmployeeId: employeeId,company_code: sessionStorage.getItem("selectedCompanyCode")
  //     }

  //     const response = await fetch(`${config.apiBaseUrl}/delemployeedoc`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(deatils),
  //     });

  //     if (response.status === 200) {
  //       console.log("Data deleted successfully");
  //       setTimeout(() => {
  //         toast.success("Data deleted successfully!", {
  //           onClose: () => window.location.reload(),
  //         });
  //       }, 1000);
  //     } else {
  //       const errorResponse = await response.json();
  //       console.error(errorResponse.message);
  //       toast.warning(errorResponse.message, {
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error delete data:", error);
  //     toast.error('Error delete data: ' + error.message, {
  //     });
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(employeeId)
    }
  };

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

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getempdoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ employee_id, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setSaveButtonVisible(false);
        setIsAcademicDataLoaded(true);

        const updatedDocument = searchData.reduce((acc, item) => {
          const { document_name, document_files, keyfield } = item;

          console.log(document_files)
          let documentUrl = null;
          let documentFile = null;

          if (document_files) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document_files);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          console.log(documentUrl)

          const memberData = {
            documentName: document_name || "",
            selectDocumentName: document_name
              ? { value: document_name, label: document_name }
              : null,
            documentUrl: documentUrl,
            document: documentFile,
            keyfield: keyfield
          };

          const existingRelation = acc.find(group => group.relation === document_name);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: document_name,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setDocuments(updatedDocument);
        setEmployeeId(employee_id);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setDocuments([
          {
            relation: 'documents',
            members: [{
              documentName: '',
              document: null,
              documentUrl: ''
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

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleAddRow = (relation) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { documentType: '', documentNo: '', issueDate: '', expiryDate: '' }] }
          : item
      )
    );
  };

  const handleDeleteRow = (relation, index) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const handleChangeDocumentName = (selectDocumentName, relation, index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  documentName: selectDocumentName
                    ? selectDocumentName.value
                    : "",
                  selectDocumentName: selectDocumentName,
                }
                : member
            ),
          }
          : doc
      )
    );
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })

      .then((data) => data.json())
      .then((val) => setDocumentNameDrop(val));
  }, []);

  const filteredOptionDocumentName = Array.isArray(documentNameDrop)
    ? documentNameDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  // const handleFileChange = (event, index) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'application/pdf') {
  //     const fileUrl = URL.createObjectURL(file);

  //     setDocuments((prevDocuments) => {
  //       const updatedDocuments = [...prevDocuments];
  //       updatedDocuments[0].members[index].document = file;
  //       updatedDocuments[0].members[index].documentUrl = fileUrl;
  //       return updatedDocuments;
  //     });

  //     setDocumentUrl((prev) => ({
  //       ...prev,
  //       [index]: fileUrl,
  //     }));
  //   } else {
  //     toast.warning('Please upload a valid PDF file.');
  //     event.target.value = '';
  //   }
  // };

  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);

      setDocuments((prevDocuments) =>
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


  const handleUpdate = async (relationName, index) => {
    const relationGroup = documents.find(group => group.relation === relationName);
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

    // if (!member.documentName || !member.document||member.keyfield) {
    //   setError(" ");

    //   return;
    // }


    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const editedData = {
      EmployeeId: employeeId,
      document_name: member.documentName,
      document_files: fileBase64,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      modified_by: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to update the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/updateempDoc`, {
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

  const handleDelete = async (relationName, index) => {
    const relationGroup = documents.find(group => group.relation === relationName);
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

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };
    setLoading(true)

    showConfirmationToast(
      "Are you sure you want to Delete the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/delempdoc`, {
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

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      const [{ EmployeeId }] = data;

      handleRefNo(EmployeeId);
      setEmployeeId(EmployeeId);
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId);
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

    if (
      employeeId &&
      documentNameDrop?.length > 0
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, documentNameDrop]);

  const handleRemovePdf = (relation, index) => {
    setDocuments(prev =>
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
          <h1 className="page-title">Documents</h1>

          <div className="action-wrapper desktop-actions">
            {saveButtonVisible && ['add', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
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

              {saveButtonVisible && ['add', 'all permission'].some(p => documentsPermissions.includes(p)) && (
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
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <label for="cno" className={`exp-form-labels ${error && !employeeId ? 'text-danger' : ''}`}>Employee ID<span className="text-danger">*</span></label>
              <span className="select-add-btn" title="Documents Help" onClick={handleEmployeeInfo}>
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

      {documents.map((relationGroup, relationIndex) => (
        <div key={relationIndex} className="shadow-lg p-2 bg-light rounded mt-2 container-form-box">
          {relationGroup.members.map((member, index) => (
            <div key={index} className="row g-3">

              <div className="col-md-1">
                <div className="inputGroup">
                  <button type="button" onClick={() => handleAddRow(relationGroup.relation)} className="btn btn-primary" title="Add Row">
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  {relationGroup.members.length > 1 && (
                    <button type="button" onClick={() => handleDeleteRow(relationGroup.relation, index)} className="btn btn-danger" title="Delete Row">
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <div
                  className={`inputGroup selectGroup 
              ${member.selectDocumentName ? "has-value" : ""} 
               ${isSelectDocument[index] ? "is-focused" : ""}`}
                >
                  <Select
                    id={`cname-${index}`}
                    placeholder=" "
                    onFocus={() => setIsSelectDocument((prev) => ({ ...prev, [index]: true }))}
                    onBlur={() => setIsSelectDocument((prev) => ({ ...prev, [index]: false }))}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    value={member.selectDocumentName}
                    maxLength={50}
                    onChange={(selectDocumentName) =>
                      handleChangeDocumentName(selectDocumentName, relationGroup.relation, index)
                    }
                    options={filteredOptionDocumentName}
                  />
                  <label htmlFor={`cname-${index}`} className={`floating-label ${error && !member.documentName ? 'text-danger' : ''}`}>
                    Document Name<span className="text-danger">*</span>
                  </label>
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

              <div className="col-md-1">
                {isAcademicDataLoaded && (
                  <div className="inputGroup">
                    {['update', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                      <button
                        type="button"
                        className="btn btn-success"
                        title="Update"
                        onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                      >
                        <i className="fa-solid fa-floppy-disk"></i>
                      </button>
                    )}
                    {['delete', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(relationGroup.relation, index)}
                      >
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
        <DocumentPopup open={open} handleClose={handleClose} EmployeeInfo={EmployeeInfo} />
        <PdfPreview open={isModalOpen} pdfUrl={currentPdfUrl} handleClose={handleCloseModal} />
      </div>
    </div>
  );
}
export default Input;