import React, { useState, useRef } from "react";
import "./input.css";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');

function PrintTemplate() {

    const [Academic, setAcademic] = useState([{ relation: 'Screens', members: [{ screenName: '', templatename: '', Templates: null, documentUrl: '' }] }]);
    const [Screens, setScreens] = useState("");
    const [templatename, settemplatename] = useState("");
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const navigate = useNavigate();
    const [saveButtonVisible, setSaveButtonVisible] = useState(true);
    const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
    const employeeIdRef = useRef(null);
    const [showAsterisk, setShowAsterisk] = useState(true);
    const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePdfClick = (url) => {
        setCurrentPdfUrl(url);
        setIsModalOpen(true);
    };

    const addRow = (relation) => {
        setAcademic((prev) =>
            prev.map((item) =>
                item.relation === relation
                    ? { ...item, members: [...item.members, { screenName: '', templatename: '', institution: '', }] }
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
        setLoading(true);


        const employeeData = await Promise.all(

            Academic.flatMap((relationGroup) =>
                relationGroup.members.map(async (member) => {
                    if (member.Templates) {
                        const fileSize = member.Templates.size;
                        const maxSize = 1 * 1024 * 1024; // 1MB

                        if (fileSize > maxSize) {
                            toast.warning('File size exceeds 1MB. Please upload a smaller file.');
                            return;
                        }

                        const fileBase64 = member.Templates ? await convertToBase64(member.Templates) : null;
                        console.log(fileBase64)
                        return {
                            Screens: member.screenName,
                            Template_name: member.templatename,
                            Templates: fileBase64,
                            created_by: sessionStorage.getItem("selectedUserCode"),
                            company_code: sessionStorage.getItem("selectedCompanyCode")
                        };
                    }
                })
            )

        );

        try {
            const response = await fetch(`${config.apiBaseUrl}/AddPrintTemplate`, {
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
        }
        finally {
      setLoading(false);
    }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(Screens)
        }
    };

    const detectMimeTypeFromBuffer = (bufferData) => {
        const hex = bufferData.slice(0, 4).map(b => b.toString(16).toUpperCase());
        if (hex[0] === "25" && hex[1] === "50") return "application/pdf";
        if (hex[0] === "FF" && hex[1] === "D8") return "image/jpeg";
        if (hex[0] === "89" && hex[1] === "50") return "image/png";
        return "application/octet-stream";
    };


    const convertBufferToBlobUrlAndFile = (buffer, fileName = "template") => {
        if (buffer && buffer.type === "Buffer") {
            const byteArray = new Uint8Array(buffer.data);
            const mimeType = detectMimeTypeFromBuffer(buffer.data);
            const blob = new Blob([byteArray], { type: mimeType });
            const extension = mimeType === "application/pdf" ? ".pdf"
                : mimeType === "image/jpeg" ? ".jpg"
                    : mimeType === "image/png" ? ".png"
                        : "";
            const blobUrl = URL.createObjectURL(blob);
            const file = new File([blob], fileName + extension, { type: mimeType });
            return { blobUrl, file, mimeType };
        }
        return { blobUrl: null, file: null, mimeType: null };
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

    const handleRemoveTemplate = (index) => {
        setAcademic(prev => {
            const updated = [...prev];
            updated[0].members[index].Templates = null;
            updated[0].members[index].documentUrl = null;
            return updated;
        });

        const input = document.getElementById(`templateUpload${index}`);
        if (input) input.value = "";
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (file && allowedTypes.includes(file.type)) {
            const fileUrl = URL.createObjectURL(file);
            setAcademic(prev => {
                const updated = [...prev];
                updated[0].members[index].Templates = file;
                updated[0].members[index].documentUrl = fileUrl;
                return updated;
            });
        } else {
            toast.warning('Please upload a valid PDF or image file (JPEG, PNG).');
            event.target.value = '';
        }
    };

    const reloadGridData = () => {
        window.location.reload();
    };

const handleUpdate = async (relationName, index) => {
    const relationGroup = Academic.find(group => group.relation === relationName);
    const member = relationGroup?.members[index];

    if (!member) {
        toast.error("Invalid record selected");
        return;
    }

    if (!member.keyfield) {
        toast.warning("Missing Key Field (Cannot update)");
        return;
    }

    if (!member.screenName || !member.templatename) {
        toast.warning("Please fill all required fields");
        return;
    }

    const fileBase64 = member.Templates ? await convertToBase64(member.Templates) : null;

    const editedData = {
        Screens: member.screenName,
        Template_name: member.templatename,
        Templates: fileBase64,
        Key_field: member.keyfield,
        modified_by: sessionStorage.getItem("selectedUserCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    try {
        const response = await fetch(`${config.apiBaseUrl}/PrintTemplateUpdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editedData: [editedData] })
        });

        if (response.ok) {
            toast.success("Template Updated Successfully!", {
                // onClose: () => window.location.reload(),
            });
        } else {
            const err = await response.json();
            toast.warning(err.message || "Failed to update");
        }
    } catch (err) {
        toast.error("Error updating: " + err.message);
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
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/Templatesearch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Screens, templatename }),
            });
            if (response.ok) {
                const searchData = await response.json();
                if (searchData.length > 0) {
                    const updatedTemplateMembers = searchData.reduce((acc, item) => {
                        const { Screens, Template_name, Templates, Key_field } = item;
                        let documentUrl = null;
                        let documentFile = null;
                        if (Templates) {
                            const { blobUrl, file } = convertBufferToBlobUrlAndFile(Templates, Template_name);
                            documentUrl = blobUrl;
                            documentFile = file;
                        }
                        const memberData = {
                            screenName: Screens,
                            templatename: Template_name,
                            keyfield: Key_field,
                            documentUrl,
                            Templates: documentFile,
                        };
                        const existingRelation = acc.find(group => group.relation === Screens);
                        if (existingRelation) {
                            existingRelation.members.push(memberData);
                        } else {
                            acc.push({ relation: Screens, members: [memberData] });
                        }
                        return acc;
                    }, []);
                    setAcademic(updatedTemplateMembers);
                    setSaveButtonVisible(false);
                    setIsAcademicDataLoaded(true)
                    setShowAsterisk(false);
                } else {
                    toast.warning("No matching data found");
                    setAcademic([]);
                }
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
                setAcademic([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data: " + error.message);
        }
        finally {
      setLoading(false);
    }
    };


    return (
        <div className="container-fluid Topnav-screen">
        {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-light rounded main-header-box">
                <div className="header-flex">
                    <h1 className="page-title">Print Templates</h1>

                    <div className="action-wrapper desktop-actions">
                    {saveButtonVisible &&
                        <div onClick={handleSave} className="action-icon add">
                            <span className="tooltip">Save</span>
                            <i className="fa-solid fa-floppy-disk"></i>
                        </div>
}
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="dropdown mobile-actions">
                        <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
                            <i className="fa-solid fa-list"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end text-center">
                            {/* {['add', 'all permission'].some(p => companyPermissions.includes(p)) && ( */}
                             {saveButtonVisible &&
                            <li className="dropdown-item" onClick={handleSave}>
                                <i className="fa-solid fa-floppy-disk"></i>
                            </li>
}
                            {/* )} */}
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
                                placeholder=""
                                required
                                value={Screens}
                                ref={employeeIdRef}
                                onChange={(e) => setScreens(e.target.value)}
                                maxLength={18}
                                onKeyPress={handleKeyPress}
                                autoComplete="off"
                            />
                            <label className="exp-form-labels">Screens</label>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="inputGroup">
                            <input
                                id="employeeId"
                                className="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the EmployeeId"
                                value={templatename}
                                ref={employeeIdRef}
                                onChange={(e) => settemplatename(e.target.value)}
                                maxLength={18}
                                onKeyPress={handleKeyPress}
                                autoComplete="off"
                            />
                            <label className="exp-form-labels">Template Name</label>
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

            <div>
                {Academic.map((relationGroup, relationIndex) => (
                    <div key={relationIndex} className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
                        {relationGroup.members.map((member, index) => (
                            <div key={index} className="row g-3">
                                <div className="col-md-1 ">
                                    <div className="inputGroup">
                                        <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                        </button>
                                        {relationGroup.members.length > 1 && (
                                            <button type="button" className="btn btn-danger ms-2"
                                                onClick={() => deleteRow(relationGroup.relation, index)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="inputGroup">
                                        <input
                                            type="text"
                                            className="exp-input-field form-control"
                                            value={member.screenName}
                                            placeholder=" "
                                            maxLength={50}
                                            title="Please enter the Academic Name"
                                            onChange={(e) => RelationInputChange(relationGroup.relation, index, 'screenName', e.target.value)}
                                        />
                                        <label className={` exp-form-labels ${error && !member.screenName ? 'red' : ''}`}>Screens{showAsterisk && <span className="text-danger">*</span>}</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="inputGroup">
                                        <input
                                            type="text"
                                            className="exp-input-field form-control"
                                            value={member.templatename}
                                            placeholder=" "
                                            maxLength={125}
                                            title="Please enter the Major"
                                            onChange={(e) => RelationInputChange(relationGroup.relation, index, 'templatename', e.target.value)}
                                        />
                                        <label className={`exp-form-labels${error && !member.templatename ? 'red' : ''}`}>Template Name{showAsterisk && <span className="text-danger">*</span>}</label>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="inputGroup">
                                        <div className="image-upload-container">
                                            {member.documentUrl ? (
                                                <div className="image-preview-box">
                                                    {member.Templates?.type?.includes("pdf") ||
                                                        member.Templates?.name?.endsWith(".pdf") ? (
                                                        <iframe
                                                            src={member.documentUrl}
                                                            title="PDF Preview"
                                                            className="uploaded-pdf"
                                                            style={{ width: "100%", height: "100%", border: "none" }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={member.documentUrl}
                                                            alt="Uploaded Template"
                                                            className="uploaded-image"
                                                        />
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="delete-image-btn"
                                                        onClick={() => handleRemoveTemplate(index)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="upload-placeholder-box"
                                                    onClick={() => document.getElementById(`templateUpload${index}`).click()}
                                                >
                                                    <div className="upload-icon-text">
                                                        <i className="fa-regular fa-image upload-icon me-1"></i>
                                                        <span>Upload Template</span>
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                id={`templateUpload${index}`}
                                                className="exp-input-field form-control hidden-file-input"
                                                accept=".pdf,.jpeg,.jpg,.png"
                                                onChange={(e) => handleFileChange(e, index)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-1 mt-4">
                                    {isAcademicDataLoaded && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                title="Update"
                                                onClick={() => handleUpdate(relationGroup.relation, index)}
                                            >
                                                <i className="fa-solid fa-floppy-disk"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                title="Delete"
                                                onClick={() => handleDelete(relationGroup.relation, index)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PrintTemplate;
