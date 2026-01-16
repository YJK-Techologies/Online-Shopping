import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import TabButtons from '../ESSComponents/Tabs';
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from '../ToastConfirmation';
import '../apps.css'
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function CandidateMaster() {

  const [phone, setphone] = useState("");
  const [applied_job_id, setapplied_job_id] = useState("");
  const [applied_job_idSC, setapplied_job_idSC] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [department_idSC, setdepartment_idSC] = useState("");
  const [email, setemail] = useState("");
  const [emailSC, setemailSC] = useState("");
  const [phoneSC, setphoneSC] = useState("");
  const [candidate_name, setcandidate_name] = useState("");
  const [candidate_nameSC, setcandidate_nameSC] = useState("");
  const [error, setError] = useState("");
  const [rowData, setRowData] = useState([]);
  const [activeTab, setActiveTab] = useState("Candiate Master")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const body = {
        candidate_name: candidate_nameSC,
        email: emailSC,
        phone: phoneSC,
        department_id: department_idSC,
        applied_job_id: applied_job_idSC,
        company_code: sessionStorage.getItem("selectedCompanyCode")
      };

      const response = await fetch(`${config.apiBaseUrl}/CandidateSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          candidate_id: matchedItem.candidate_id,
          email: matchedItem.email,
          phone: matchedItem.phone,
          candidate_name: matchedItem.candidate_name,
          applied_job_id: matchedItem.applied_job_id,
          department_id: matchedItem.department_id,
          keyfield: matchedItem.keyfield,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { candidate_masterData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/candidate_masterLoopUpdate`, {
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

  const handleDelete = async (rowData) => {
    setLoading(true);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { candidate_masterData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/candidate_masterLoopDelete`, {
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

  const reloadGridData = () => {
    setRowData([]);
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
      headerName: "Candidate Id",
      field: "candidate_id",
      editable: false,
    },
    {
      headerName: "Candidate Name",
      field: "candidate_name",
      editable: true,
    },
    {
      headerName: "Email",
      field: "email",
      editable: true,
    },
    {
      headerName: "Phone",
      field: "phone",
      editable: true,
    },
    {
      headerName: "Applied Job ID",
      field: "applied_job_id",
      editable: true,
    },
    {
      headerName: "Department ID",
      field: "department_id",
      editable: true,
    },
    {
      headerName: "Keyfield ",
      field: "keyfield",
      editable: false,
      hide: true
    },
  ]

  const tabs = [
    { label: 'Candiate Master' },
    { label: 'Job Master' },
    { label: 'Interview Panel' },
    { label: 'Interview Panel Members' },
    { label: 'Interview schedule' },
    { label: 'Interview Feedback' },
    { label: 'Interview Decision' }
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case 'Candiate Master':
        CandidateMaster();
        break;
       case 'Job Master':
        JobMaster();
        break;
      case 'Interview Panel':
        InterviewPanel();
        break;
      case 'Interview Panel Members':
        InterviewPanelMembers();
        break;
     
      case 'Interview schedule':
        InterviewSchedule();
        break;
      case 'Interview Feedback':
        InterviewFeedback();
        break;
      case 'Interview Decision':
        InterviewDecision();
        break;
      default:
        break;
    }
  };

  const CandidateMaster = () => {
    navigate("/CandidateMaster");
  };
  
  
 const JobMaster = () => {
    navigate("/JobMaster");
  };

  const InterviewPanel = () => {
    navigate("/InterviewPanel");
  };

 const InterviewPanelMembers = () => {
    navigate("/InterviewPanelMem");
  };

  const InterviewSchedule = () => {
    navigate("/InterviewSchedule");
  };

  const InterviewFeedback = () => {
    navigate("/InterviewFeedback");
  };

  const InterviewDecision = () => {
    navigate("/InterviewDecision");
  };

 

  const handleSave = async () => {
    if (!candidate_name) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {


      const Header = {
        email: email,
        phone: phone,
        applied_job_id: applied_job_id,
        candidate_name: candidate_name,
        department_id: department_id,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };
      const response = await fetch(`${config.apiBaseUrl}/candidate_masterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      console.log("Response Status:", response.status);

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            // onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error);
    } finally {
      setLoading(false);
    }
  };

  // const handleRowSelection = (row) => {
  //   setFromDate(formatDate(row.FromDate)); // Ensure correct format
  //   setToDate(formatDate(row.ToDate));
  //   setEligibledays(row.Salary_Days);
  //   // setSelectedRow(row);
  // };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Interview Masters </h1>
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
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={candidate_name}
                onChange={(e) => setcandidate_name((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !candidate_name ? 'text-danger' : ''}`}>Candidate Name<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={email}
                onChange={(e) => setemail((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !email ? 'text-danger' : ''}`}>Email<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={phone}
                onChange={(e) => setphone((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !phone ? 'text-danger' : ''}`}>Phone<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={applied_job_id}
                onChange={(e) => setapplied_job_id((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !applied_job_id ? 'text-danger' : ''}`}>Applied Job ID<span className="text-danger">*</span></label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={department_id}
                onChange={(e) => setdepartment_id((e.target.value))}
              />
              <label for="sname" className={` exp-form-labels ${error && !department_id ? 'text-danger' : ''}`}>Department ID<span className="text-danger">*</span></label>
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
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={candidate_nameSC}
                onChange={(e) => setcandidate_nameSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname">Candiate Name</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={emailSC}
                onChange={(e) => setemailSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname">Email </label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={phoneSC}
                onChange={(e) => setphoneSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname">Phone</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="Number"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={applied_job_idSC}
                onChange={(e) => setapplied_job_idSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname">Applied Job ID</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please Enter the Eligibility Salary Days"
                autoComplete="off"
                value={department_idSC}
                onChange={(e) => setdepartment_idSC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label for="sname">Department ID</label>
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
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            // onRowClicked={(event) => handleRowSelection(event.data)}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>




    </div>
  )
}
export default CandidateMaster;