import React, { useState, useEffect, useContext } from "react";
import { listPrograms, downloadPDF } from "../../api/ngo";
import { AuthContext } from "../../context/AuthContext";

const ProgramList = () => {
  const { accessToken } = useContext(AuthContext);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const res = await listPrograms(accessToken);
      setPrograms(res.data);
    };
    fetchPrograms();
  }, [accessToken]);

  const handleDownload = async (programId, programName) => {
    const res = await downloadPDF(programId, accessToken);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${programName}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="table-container">
      <h2>NGO Programs</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => (
            <tr key={p.id}>
              <td>{p.program_name}</td>
              <td>{p.description}</td>
              <td>{p.location}</td>
              <td>{p.start_date} {p.start_time}</td>
              <td>{p.end_date} {p.end_time}</td>
              <td><button onClick={()=>handleDownload(p.id, p.program_name)}>Download PDF</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramList;
