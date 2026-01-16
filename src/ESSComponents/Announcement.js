import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import { showConfirmationToast } from '../ToastConfirmation';
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {

  const [error, setError] = useState("");
  const [StatusDrop, setStatusDrop] = useState([]);
  const [statusdrop, setstatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [TypeGridDrop, setTypeGridDrop] = useState([]);
  const [DetailsGridDrop, setDetailsGridDrop] = useState([]);
  const [MsgTypeGridDrop, setMsgTypeGridDrop] = useState([]);
  const [DurationGridDrop, setDurationGridDrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedstatus, setselectedstatus] = useState('');
  const [Announcementid, setAnnouncementid] = useState('');
  const [Announcement, setAnnouncement] = useState('');
  const [announcement, setannouncement] = useState('');
  const [messagetitle, setmessagetitle] = useState('');
  const [startdate, setstartdate] = useState('');
  const [enddate, setenddate] = useState('');
  const [Start_Time, setstarttime] = useState('');
  const [End_Time, setendtime] = useState('');
  const [rowData, setrowData] = useState([]);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [type, settype] = useState("");
  const [Type, setType] = useState("");
  const [typedrop, settypedrop] = useState([]);
  const [TypeDrop, setTypeDrop] = useState([]);
  const [selectDetails, setselectedDetails] = useState("");
  const [selectdetails, setselecteddetails] = useState("");
  const [Details, setDetails] = useState("");
  const [details, setdetails] = useState("");
  const [Detailsdrop, setDetailsrop] = useState([]);
  const [detailsdrop, setdetailsdrop] = useState([]);
  const [MessageType, setMessageType] = useState("");
  const [messagetype, setmessagetype] = useState("");
  const [selectedMessageType, setselectedMessageType] = useState('');
  const [selectedmessagetype, setselectedmessagetype] = useState('');
  const [Status, setStatus] = useState('');
  const [status, setstatus] = useState('');
  const [selectedAnnouncement, setselectedAnnouncement] = useState('');
  const [selectedannouncement, setselectedannouncement] = useState('');
  const [AnnouncementDrop, setAnnouncementDrop] = useState([]);
  const [announcementdrop, setannouncementdrop] = useState([]);
  const [MsgTypeDrop, setMsgTypeDrop] = useState('');
  const [msgtypedrop, setmsgtypedrop] = useState('');
  const [RequestfordoNotShowAgainOption, setRequestfordoNotShowAgainOption] = useState("");

  //filter option
  const [Announcement_id, setAnnouncement_id] = useState("");
  const [SelectType, setSelectType] = useState("");
  const [selecttype, setselecttype] = useState("");
  const [Start_Date, setstartDate] = useState("");
  const [End_Date, setEndDate] = useState("");
  const [Start_time, setstart_time] = useState("");
  const [endtime, setend_time] = useState("");
  const [MessageTitle, setmessageTitle] = useState("");
  const [selectedAnnouncementvalid, setselectedAnnouncementvalid] = useState("");
  const [isSelectType, setIsSelectType] = useState(false);
  const [isSelectDetails, setIsSelectDetails] = useState(false);
  const [isSelectMT, setIsSelectMT] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSelecttype, setIsSelecttype] = useState(false);
  const [isSelectdetails, setIsSelectdetails] = useState(false);
  const [isSelectmessagetype, setIsSelectmessagetype] = useState(false);
  const [isSelectstatus, setIsSelectstatus] = useState(false);
  const [loading, setLoading] = useState(false);
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
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk" title="Save"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash" title="Delete"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Announcement Id",
      field: "Announcement_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Select Type",
      field: "SelectType",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: TypeGridDrop,
        maxLength: 250,
      },
    },
    {
      headerName: "Select Details",
      field: "SelectDetails",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: DetailsGridDrop,
        maxLength: 10,
      },
    },
    {
      headerName: "Announcement Duration",
      field: "AnnouncementValidFor",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: DurationGridDrop,
        maxLength: 10,
      },
    },
    {
      headerName: "Message Type",
      field: "Messagetype",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: MsgTypeGridDrop,
        maxLength: 10,
      },
    },
    {
      headerName: "Message Title",
      field: "MessageTitle",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
        maxLength: 250,
      },
    },
    {
      headerName: "Request for Do Not Show Again",
      field: "RequestfordoNotShowAgainOption",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Start Date",
      field: "Start_Date",
      editable: true,
      cellStyle: { textAlign: "left" },
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
      headerName: "Start Time",
      field: "Start_Time",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "End Date",
      field: "End_Date",
      editable: true,
      cellStyle: { textAlign: "left" },
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
      headerName: "End Time",
      field: "End_Time",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/AnnouncementSearchCretria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Announcement_id: Announcement_id,
          SelectType: type,
          SelectDetails: details,
          AnnouncementValidFor: announcement,
          Messagetype: messagetype,
          RequestfordoNotShowAgainOption: RequestfordoNotShowAgainOption,
          MessageTitle: MessageTitle,
          status: status,
          Start_Date: startdate,
          Start_Time: Start_Time,
          End_Date: enddate,
          End_Time: End_Time,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setrowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setrowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const reloadData = () => {
    setrowData([])
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setStatusDrop(val)
        setstatusdrop(val)

      });
  }, []);

  const filteredOptionStatus = StatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredoptionstatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeStatus = (Status) => {
    setSelectedStatus(Status);
    setStatus(Status ? Status.value : '');
  };

  const handlechangestatus = (status) => {
    setselectedstatus(status);
    setstatus(status ? status.value : '');
  };


  const handleSave = async () => {
    if (!Announcementid || !Type || !startdate || !enddate || !Start_Time || !End_Time || !Details || !MessageType || !messagetitle || !Status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);
    try {
      const Header = {
        Announcement_id: Announcementid,
        SelectType: Type,
        SelectDetails: Details,
        AnnouncementValidFor: Announcement,
        Messagetype: MessageType,
        RequestfordoNotShowAgainOption: RequestfordoNotShowAgainOption,
        MessageTitle: messagetitle,
        status: Status,
        Start_Date: startdate,
        Start_Time: Start_Time,
        End_Date: enddate,
        End_Time: End_Time,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addAnnounmentdetails`, {
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
        toast.warning(errorResponse.message || "Failed to insert announcement data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveEditedData = async () => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
    setLoading(true);

        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateAnnouncementDetails`, {
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


  const deleteSelectedRows = async (rowData) => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };
    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
    setLoading(true);

        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteAnnouncement`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend),
          });


          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        } finally {
      setLoading(false);
    }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };


  const handlechangetype = (selecttype) => {
    setselecttype(selecttype);
    settype(selecttype ? selecttype.value : '');
  };
  const handleChangeType = (SelectType) => {
    setSelectType(SelectType);
    setType(SelectType ? SelectType.value : '');
  };

  const filteredOptiontype = typedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionType = TypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getannoncementtype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        settypedrop(val)
        setTypeDrop(val)

      });
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getannoncementtype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const TypeOption = data.map(option => option.attributedetails_name);
        setTypeGridDrop(TypeOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAnnouncementDetail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setDetailsrop(val)
        setdetailsdrop(val)
      });
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getAnnouncementDetail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const DetailsOption = data.map(option => option.attributedetails_name);
        setDetailsGridDrop(DetailsOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionDetails = Detailsdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredoptiondetails = detailsdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeDetails = (selectDetails) => {
    setselectedDetails(selectDetails);
    setDetails(selectDetails ? selectDetails.value : '');
  };

  const handlechangedetails = (selectdetails) => {
    setselecteddetails(selectdetails);
    setdetails(selectdetails ? selectdetails.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAnnouncement_Msg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setMsgTypeDrop(val)
        setmsgtypedrop(val)
      });
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getAnnouncement_Msg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const MsgTypeOption = data.map(option => option.attributedetails_name);
        setMsgTypeGridDrop(MsgTypeOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionMsgType = Array.isArray(MsgTypeDrop)
    ? MsgTypeDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredoptionmsgtype = Array.isArray(msgtypedrop)
    ? msgtypedrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const handleChangeMsgType = (selectedMessageType) => {
    setselectedMessageType(selectedMessageType);
    setMessageType(selectedMessageType ? selectedMessageType.value : '');
  };

  const handlechangemsgtype = (selectedmessagetype) => {
    setselectedmessagetype(selectedmessagetype);
    setmessagetype(selectedmessagetype ? selectedmessagetype.value : '');
  };


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getAnnouncementDuration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    }).then((data) => data.json())
      .then((val) => {
        setannouncementdrop(val)
        setAnnouncementDrop(val)
      });
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getAnnouncementDuration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        const DurationOption = data.map(option => option.attributedetails_name);
        setDurationGridDrop(DurationOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChangeAnnouncement = (selectedAnnouncement) => {
    setselectedAnnouncement(selectedAnnouncement);
    setAnnouncement(selectedAnnouncement ? selectedAnnouncement.value : '');
  };

  const handleChangeannouncement = (selectedannouncement) => {
    setselectedannouncement(selectedannouncement);
    setannouncement(selectedannouncement ? selectedannouncement.value : '');
  };

  const filteredOptionAnnouncement = Array.isArray(AnnouncementDrop)
    ? AnnouncementDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredoptionannouncement = Array.isArray(announcementdrop)
    ? announcementdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Add Announcement</h1>
          <div className="action-wrapper desktop-actions">
            <div class=" d-flex justify-content-end  me-3">
              {saveButtonVisible && (
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
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {/* {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && ( */}
              {saveButtonVisible && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}
              {/* )} */}

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
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Announcement ID "
                value={Announcementid}
                onChange={(e) => setAnnouncementid(e.target.value)}
              />
              <label for="cname" className={` exp-form-labels ${error && !Announcementid ? 'text-danger' : ''}`}> Announcement ID{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${SelectType ? "has-value" : ""} 
              ${isSelectType ? "is-focused" : ""}`}
            >
              <Select
                id="SelectType"
                classNamePrefix="react-select"
                value={SelectType}
                onChange={handleChangeType}
                options={filteredOptionType}
                placeholder=""
                isClearable
                onFocus={() => setIsSelectType(true)}
                onBlur={() => setIsSelectType(false)}
              />
              <label for="sname" className={` floating-label  ${error && !SelectType ? 'text-danger' : ''}`}>Select Type{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectDetails ? "has-value" : ""} 
              ${isSelectDetails ? "is-focused" : ""}`}
            >
              <Select
                id="SelectDetails"
                classNamePrefix="react-select"
                value={selectDetails}
                onChange={handleChangeDetails}
                options={filteredOptionDetails}
                placeholder=""
                isClearable
                onFocus={() => setIsSelectDetails(true)}
                onBlur={() => setIsSelectDetails(false)}
              />
              <label for="add1" className={` floating-label ${error && !selectDetails ? 'text-danger' : ''}`}>Select Details{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>
          {/* <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add1" className={`${error && !selectedAnnouncement ? 'red' : ''}`}>Announcement Duration{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <Select
                      id="SelectDetails"
                      class="exp-input-field form-control"
                      required title="Please Select the Announcement Duration"
                      value={selectedAnnouncement}
                      onChange={handleChangeAnnouncement}
                      options={filteredOptionAnnouncement}
                    />
                  </div>
                </div> */}
          {/* {selectedAnnouncement.label === "Day" && ( */}
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please enter the Date"
                value={startdate}
                onChange={(e) => setstartdate(e.target.value)}
              />
              <label for="add1" className={` exp-form-labels ${error && !startdate ? 'text-danger' : ''}`}>Start Date{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please enter the Date"
                value={enddate}
                onChange={(e) => setenddate(e.target.value)}
              />
              <label for="add1" className={` exp-form-labels ${error && !enddate ? 'text-danger' : ''}`}>End Date{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>
          {/* )} */}
          {/* {selectedAnnouncement.label === "Time" && ( */}
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="time"
                placeholder=""
                required title="Please enter the Time"
                value={Start_Time}
                onChange={(e) => setstarttime(e.target.value)}
              />
              <label for="add1" className={` exp-form-labels ${error && !Start_Time ? 'text-danger' : ''}`}>Start Time{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="time"
                placeholder=""
                required title="Please enter the Time"
                value={End_Time}
                onChange={(e) => setendtime(e.target.value)}
              />
              <label for="add1" className={` exp-form-labels ${error && !End_Time ? 'text-danger' : ''}`}>End Time{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedMessageType ? "has-value" : ""} 
              ${isSelectMT ? "is-focused" : ""}`}
            >
              <Select
                id="MessageType"
                value={selectedMessageType}
                onChange={handleChangeMsgType}
                options={filteredOptionMsgType}
                classNamePrefix="react-select"
                placeholder=""
                isClearable
                onFocus={() => setIsSelectMT(true)}
                onBlur={() => setIsSelectMT(false)}
                required title="Please Select the Message Type"
              />
              <label for="add1" className={` floating-label ${error && !selectedMessageType ? 'text-danger' : ''}`}>Message Type{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Message Title"
                value={messagetitle}
                onChange={(e) => setmessagetitle(e.target.value)}
              />
              <label for="add1" className={`exp-form-labels ${error && !messagetitle ? 'text-danger' : ''}`}>Message Title{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                classNamePrefix="react-select"
                placeholder=""
                isClearable
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
              />
              <label className={`floating-label ${error && !Status ? 'text-danger' : ''}`}>Status{showAsterisk && <span className="text-danger">*</span>}</label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="header-flex">
          <h5 className="">Search Criteria:</h5>
        </div>
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Announcement ID"
                value={Announcement_id}
                onChange={(e) => setAnnouncement_id(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="cname" className="exp-form-labels">Announcement ID</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selecttype ? "has-value" : ""} 
              ${isSelecttype ? "is-focused" : ""}`}
            >
              <Select
                id="SelectType"
                value={selecttype}
                onChange={handlechangetype}
                options={filteredOptiontype}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder=" "
                onFocus={() => setIsSelecttype(true)}
                onBlur={() => setIsSelecttype(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label for="sname" className="floating-label">Select Type</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectdetails ? "has-value" : ""} 
              ${isSelectdetails ? "is-focused" : ""}`}
            >
              <Select
                id="SelectDetails"
                value={selectdetails}
                onChange={handlechangedetails}
                options={filteredoptiondetails}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder=" "
                onFocus={() => setIsSelectdetails(true)}
                onBlur={() => setIsSelectdetails(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label for="add1" className="floating-label">Select Details</label>
            </div>
          </div>
          {/* <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add1" class="exp-form-labels">Announcement Duration</label>
                      </div>
                    </div>
                    <Select
                      required title="Please Select the  Announcement Duration"
                      id="SelectDetails"
                      class="exp-input-field form-control"
                      value={selectedannouncement}
                      onChange={handleChangeannouncement}
                      options={filteredoptionannouncement}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div> */}
          {/* {selectedAnnouncementvalid.label === "Day" && (
                  <div> */}
          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please enter the Date"
                value={Start_Date}
                onChange={(e) => setstartDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">Start Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please enter the Date"
                value={End_Date}
                onChange={(e) => setEndDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">End Date</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="time"
                placeholder=""
                required title="Please enter the Time"
                value={Start_time}
                onChange={(e) => setstart_time(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">Start Time</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="time"
                placeholder=""
                required title="Please enter the Time"
                value={endtime}
                onChange={(e) => setend_time(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" className="exp-form-labels">End Time</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedmessagetype ? "has-value" : ""} 
              ${isSelectmessagetype ? "is-focused" : ""}`}
            >
              <Select
                id="MessageType"
                value={selectedmessagetype}
                onChange={handlechangemsgtype}
                options={filteredoptionmsgtype}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder=" "
                onFocus={() => setIsSelectmessagetype(true)}
                onBlur={() => setIsSelectmessagetype(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label for="add1" className="floating-label">Message Type</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the Message Title"
                value={MessageTitle}
                onChange={(e) => setmessageTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add1" class="exp-form-labels">Message Title</label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedstatus ? "has-value" : ""} 
              ${isSelectstatus ? "is-focused" : ""}`}
            >
              <Select
                id="status"
                value={selectedstatus}
                onChange={handlechangestatus}
                options={filteredoptionstatus}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder=" "
                onFocus={() => setIsSelectstatus(true)}
                onBlur={() => setIsSelectstatus(false)}
                classNamePrefix="react-select"
                isClearable
              />
              <label for="add1" class="floating-label">Status</label>
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
            pagination={true}
            gridOptions={gridOptions}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>

  );
}
export default Input;
