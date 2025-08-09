import { useState, useRef, useEffect } from 'react';

function Form() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const inputconfig = [
    { label: "Position", type: "text", name: "position" },
    { label: "Company", type: "text", name: "company" },
    { label: "Mode", type: "select", name: "mode", options: ["Work from Home", "Work from Office", "Hybrid"] },
    { label: "Location", type: "text", name: "location" },
    { label: "Salary", type: "text", name: "salary" },
    {
      label: "Status",
      type: "select",
      name: "status",
      options: ["Applying", "Applied", "Interviewing", "Negotiating", "I Withdrew", "Rejected", "No Response"]
    },
    { label: "Deadline", type: "date", name: "deadline" },
    { label: "Date Applied", type: "date", name: "dateApplied" },
    { label: "Follow Up", type: "date", name: "followUp" },
    { label: "Recruiter", type: "text", name: "recruiter" },
    { label: "Additional Notes", type: "textarea", name: "additionalNotes" },
  ];

  const [formData, setFormData] = useState(
    inputconfig.reduce((acc, curr) => {
      acc[curr.name] = '';
      return acc;
    }, {})
  );

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/dashbord/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log("Saved:", data);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };


  return (
    <>
      <button onClick={() => setShowForm(true)}>Add Job</button>
      
        <div className={showForm?"overlay":""}>
          <div className={`form-container ${showForm ? "" : "hidden"}`} ref={formRef}>
            <form onSubmit={handleSubmit} className="job-form">
              {inputconfig.map(({ label, type, name, options }, index) => (
                <div className="form-group" key={index}>
                  <label htmlFor={name} className="form-label">{label}</label>
                  {
                    type === "select" ? (
                      <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select</option>
                        {options.map((option, i) => (
                          <option key={i} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : type === "textarea" ? (
                      <textarea
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-input"
                      />
                    ) : (
                      <input
                        id={name}
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-input"
                      />
                    )
                  }
                </div>
              ))}
              <button type="submit" className="submit-btn">Add</button>
            </form>
          </div>
        </div>
      
    </>
  );
}

export default Form