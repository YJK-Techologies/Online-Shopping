import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
const config = require('../Apiconfig');

export default function TaskInputPopup({ open, handleClose, ProjectID }) {

  const [TaskMaster, setTaskMaster] = useState('');
  const [Title, setTitle] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [UserID, setUserID] = useState('');
  const [Endtime, setEndtime] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [selectedtstatus, setselectedtstatus] = useState('');
  const [status_type, setstatus_type] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [Descriptions, setDescriptions] = useState("");
  const [buffer, setbuffer] = useState("");
  const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
  const [PriorityLevel, setPriorityLevel] = useState('');
  const [PriorityDrop, setPriorityDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [userDrop, setUserDrop] = useState([]);

  const [isSelectUser, setIsSelectUser] = useState(false);
  const [isSelectTask, setIsSelectTask] = useState(false);
  const [isSelectPriority, setIsSelectPriority] = useState(false);

  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };

  const handleChangestatus = (selectedstatus) => {
    setselectedtstatus(selectedstatus);
    setstatus_type(selectedstatus ? selectedstatus.value : '');
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionTransaction = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserID(selectedUser ? selectedUser.value : '');
  };

  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setUserDrop(val));
  }, []);

  const handleSave = async (e) => {

    if (!ProjectID || !UserID || !Title || !StartDate || !EndDate || !Endtime || !Descriptions) {
      setError(" ");
      toast.warning("Missing Required Fields")
      return;
    }

    e.preventDefault();
    setSaveButtonVisible(true);
    setIsSaving(true);
    setMessage('');

    const data = {
      TaskTitle: Title,
      Description: Descriptions,
      ProjectID: ProjectID,
      userID: UserID,
      StartDate: StartDate,
      EndDate: EndDate,
      EstimatedHours: Endtime,
      TaskStatus: status_type,
      BufferHours: buffer,
      PriorityLevel: PriorityLevel,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      created_by: sessionStorage.getItem('selectedUserCode')
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ TaskMasterID }] = searchData;
        setTaskMaster(TaskMasterID);
        toast.success("Tasks inserted Successfully")
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }

    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  return (
    <div className="">
      {open && (
        <div className="modal-overlay">
          <div className="custom-modal container-fluid Topnav-screen">
            <div className="custom-modal-body">

              {/* HEADER */}
              <div className="shadow-lg p-1 bg-light main-header-box">
                <div className="header-flex">
                  <h1 className="custom-modal-title">Add Task Master</h1>

                  <div className="action-wrapper">
                    <div className="action-icon delete" onClick={handleClose}>
                      <span className="tooltip">Close</span>
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="form-row shadow-lg p-2 bg-light mt-2 container-form-box">

                {/* Project ID */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      className="exp-input-field form-control"
                      value={ProjectID}
                    />
                    <label className={`exp-form-labels ${error && !ProjectID ? 'text-danger' : ''}`}>
                      Project ID<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Task Master ID */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      className="exp-input-field form-control"
                      value={TaskMaster}
                      onChange={(e) => setTaskMaster(e.target.value)}
                    />
                    <label className="exp-form-labels">Task Master ID</label>
                  </div>
                </div>

                {/* Task Title */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      className="exp-input-field form-control"
                      value={Title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !Title ? 'text-danger' : ''}`}>
                      Task Title<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* User ID */}
                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
              ${selectedUser ? "has-value" : ""} 
              ${isSelectUser ? "is-focused" : ""}`}
                  >
                    <Select
                      placeholder=" "
                      onFocus={() => setIsSelectUser(true)}
                      onBlur={() => setIsSelectUser(false)}
                      classNamePrefix="react-select"
                      isClearable
                      value={selectedUser}
                      onChange={handleChangeUser}
                      options={filteredOptionUser}
                    />
                    <label className={`floating-label ${error && !UserID ? 'text-danger' : ''}`}>
                      User ID<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Start Date */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="date"
                      className="exp-input-field form-control"
                      value={StartDate}
                      placeholder=" "
                      autoComplete="off"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !StartDate ? 'text-danger' : ''}`}>
                      Start Date <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* End Date */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="date"
                      className="exp-input-field form-control"
                      value={EndDate}
                      placeholder=" "
                      autoComplete="off"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !EndDate ? 'text-danger' : ''}`}>
                      End Date<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Estimated Hours */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      className="exp-input-field form-control"
                      value={Endtime}
                      placeholder=" "
                      autoComplete="off"
                      onChange={(e) => setEndtime(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !Endtime ? 'text-danger' : ''}`}>
                      Estimated Hours<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Buffer Hours */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <input
                      type="text"
                      className="exp-input-field form-control"
                      value={buffer}
                      placeholder=" "
                      autoComplete="off"
                      onChange={(e) => setbuffer(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !buffer ? 'text-danger' : ''}`}>
                      Buffer Hours<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Task Description */}
                <div className="form-block col-md-3">
                  <div className="inputGroup">
                    <textarea
                      className="form-control"
                      value={Descriptions}
                      placeholder=" "
                      autoComplete="off"
                      onChange={(e) => setDescriptions(e.target.value)}
                    />
                    <label className={`exp-form-labels ${error && !Descriptions ? 'text-danger' : ''}`}>
                      Task Description<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Task Status */}
                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
              ${selectedtstatus ? "has-value" : ""} 
              ${isSelectTask ? "is-focused" : ""}`}
                  >
                    <Select
                      value={selectedtstatus}
                      onChange={handleChangestatus}
                      options={filteredOptionTransaction}
                      isClearable
                      classNamePrefix="react-select"
                      placeholder=" "
                      onFocus={() => setIsSelectTask(true)}
                      onBlur={() => setIsSelectTask(false)}
                    />
                    <label className={`floating-label ${error && !status_type ? 'text-danger' : ''}`}>
                      Task Status<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Priority Level */}
                <div className="form-block col-md-3">
                  <div
                    className={`inputGroup selectGroup 
              ${selectedPriortyLeavel ? "has-value" : ""} 
              ${isSelectPriority ? "is-focused" : ""}`}
                  >
                    <Select
                      value={selectedPriortyLeavel}
                      onChange={handleChangePriorityLevel}
                      options={filteredOptionPriorityLevel}
                      isClearable
                      classNamePrefix="react-select"
                      placeholder=" "
                      onFocus={() => setIsSelectPriority(true)}
                      onBlur={() => setIsSelectPriority(false)}
                    />
                    <label className={`floating-label ${error && !PriorityLevel ? 'text-danger' : ''}`}>
                      Priority Level<span className="text-danger">*</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-block col-md-3 mt-3">
                  <div className="search-btn-wrapper">
                    <div className="icon-btn save" onClick={handleSave}>
                      <span className="tooltip">Submit</span>
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}