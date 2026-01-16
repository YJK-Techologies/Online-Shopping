import Select from "react-select";
import { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
const config = require('../Apiconfig');

const ProjectProductivityChart = ({ }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const [projectDrop, setProjectDrop] = useState([]);
  const [employeeProjectDrop, setEmployeeProjectDrop] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployeeProject, setSelectedEmployeeProject] = useState('');
  const [project, setProject] = useState("");
  const [employeeProject, setEmployeeProject] = useState("");
  const [userDrop, setUserDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState("");

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getProjectDrop`)
  //     .then((data) => data.json())
  //     .then((val) => setProjectDrop(val));
  // }, []);

  useEffect(() => {
    const fetchProjectCode = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getProjectDrop`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"), // Or pass from props/state if needed
          }),
        });

        const data = await response.json();
        if (response.ok) {
          const updatedData = [{ ProjectID: "All", ProjectName: "All" }, ...data];
          setProjectDrop(updatedData);
          setEmployeeProjectDrop(updatedData);

          if (updatedData.length > 0) {
            const defaultProject = {
              value: updatedData[0].ProjectID,
              label: `${updatedData[0].ProjectID} - ${updatedData[0].ProjectName}`,
            };

            setSelectedProject(defaultProject);
            setSelectedEmployeeProject(defaultProject);
            setProject(defaultProject.value);
            setEmployeeProject(defaultProject.value);
          }
        } else {
          console.warn("No data found");
          setProjectDrop([]);
          setEmployeeProjectDrop([]);
        }
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };

    fetchProjectCode();
  }, []);


  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usercode`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
          const updatedData = [{ user_code: "All", user_name: "All" }, ...data];
          setUserDrop(updatedData);

          // ✅ Automatically select the first value ("All") on load
          if (updatedData.length > 0) {
            const defaultProject = {
              value: updatedData[0].user_code,
              label: `${updatedData[0].user_code} - ${updatedData[0].user_name}`,
            };

            setSelectedUser(defaultProject);
            setUser(defaultProject.value);
          }
        } else {
          console.warn("No data found");
          setUserDrop([]);
        }
      } catch (error) {
        console.error("Error fetching item codes:", error);
      }
    };

    fetchUserCode();
  }, []);

  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  const filteredOptionProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  const filteredProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  const handleChangeProject = (selectedProject) => {
    setSelectedProject(selectedProject);
    setProject(selectedProject ? selectedProject.value : '');
  };

  const handleProject = (selectedProject) => {
    setSelectedEmployeeProject(selectedProject);
    setEmployeeProject(selectedProject ? selectedProject.value : '');
  };

  useEffect(() => {
    handleProjectChart();
  }, [project])

  const handleProjectChart = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/PMSDashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ProjectID: project }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Data Not Found");
        const errorResponse = await response.json();
        throw new Error(errorResponse.details || errorResponse.message);
      }

      const fetchedData = await response.json();
      console.log("Fetched Data:", fetchedData);

      const chartData = fetchedData.map((item) => ({
        name: item.ProjectID,
        Planned: item.EstimatedHours || 0,
        Actual: item.TimeTaken || 0,
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching search data:", error.message);
      setError(error.message);
      setData([]);
    }
  };

  useEffect(() => {
    handleEmployeeProjectChart();
  }, [employeeProject, user])

  const handleEmployeeProjectChart = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/PMSEmployeechart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ProjectID: employeeProject, userid: user }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Data Not Found");
        const errorResponse = await response.json();
        throw new Error(errorResponse.details || errorResponse.message);
      }

      const fetchedData = await response.json();
      console.log("Fetched Data:", fetchedData);

      const chartData = fetchedData.map((item) => ({
        name: item.projectID,
        Actual: item.timetaken || 0,
      }));

      setData1(chartData);
    } catch (error) {
      console.error("Error fetching search data:", error.message);
      setError(error.message);
      setData1([]);
    }
  };

  return (
    <div className="container-fluid Topnav-screen">

      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Project Chart Report</h1>
        </div>
      </div>

      <div className="charts-row">

        {/* First Chart */}
        <div className="chart-box">
          <div className="d-flex justify-content-between align-items-center">

            <h2>Project Analysis</h2>

            <div className="chart-select-group">
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder=""
                value={selectedProject}
                onChange={handleChangeProject}
                options={filteredOptionProject}
              />
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Planned" fill="#ffa833" />
                <Bar dataKey="Actual" fill="#d45cfe" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Chart */}
        <div className="chart-box">
          <div className="d-flex justify-content-between align-items-center">

            <h2>Employee Based Analysis</h2>

            <div className="chart-select-group">
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                value={selectedEmployeeProject}
                onChange={handleProject}
                options={filteredProject}
              />
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                value={selectedUser}
                onChange={handleChangeUser}
                options={filteredOptionUser}
              />
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data1}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Actual" fill="#d45cfe" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProductivityChart;
