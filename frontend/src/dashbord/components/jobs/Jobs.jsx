import "./jobs.css";
import Form from './Form';
import { useEffect, useState } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [keys, setKeys] = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    fetch("http://localhost:5000/dashbord/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJobs(data.data);
          setKeys(data.keys);
          console.log(data);
        }
      });
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatHeading = (str) => {
    return str
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const toggleSelectAll = () => {
    if (selected.size === jobs.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(jobs.map(job => job._id)));
    }
  };

  const rowSelection = (id) => {
    setSelected(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  return (
    <>
      <Form />

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.size === jobs.length && jobs.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            {keys.map((key) => (
              <th key={key}>{formatHeading(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job._id}
              style={{
                backgroundColor: selected.has(job._id) ? "#d3e5ff" : "transparent",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selected.has(job._id)}
                  onChange={() => rowSelection(job._id)}
                />
              </td>
              {keys.map((key) => (
                <td key={`${job._id}-${key}`}>
                  {key.toLowerCase().includes("date") ||
                  key.toLowerCase().includes("deadline") ||
                  key.toLowerCase() === "followup"
                    ? formatDate(job[key])
                    : job[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Jobs;



