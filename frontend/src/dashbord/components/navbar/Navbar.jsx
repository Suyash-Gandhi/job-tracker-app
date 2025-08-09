import { useState } from "react"
import "./navbar.css"
import { useNavigate } from "react-router-dom"


function Navbar() {
    const [background, setBackground] = useState("jobs")
    const navigate = useNavigate()

    return (
        <div className='navbar'>
            <div >
                <button onClick={() => { setBackground("jobs"), navigate("/dashbord/jobs") }}
                    className={`tags ${background === "jobs" ? "active-btn" : ""}`}>
                    Jobs
                </button>
            </div>

            <div >
                <button onClick={() => {setBackground("Connections"), navigate("/dashbord/connections")}}
                    className={`tags ${background === "Connections" ? "active-btn" : ""}`}>
                    Connections
                </button>
            </div>

            <div >
                <button onClick={() => {setBackground("Schedule"), navigate("/dashbord/schedule")}}
                    className={`tags ${background === "Schedule" ? "active-btn" : ""}`}>
                    Schedule
                </button>
            </div>

            <div >
                <button onClick={() => {setBackground("Analytics"), navigate("/dashbord/analytics")}}
                    className={`tags ${background === "Analytics" ? "active-btn" : ""}`}>
                    Analytics
                </button>
            </div>

            <div >
                <button onClick={() => {setBackground("Review"), navigate("/dashbord/review")}}
                    className={`tags ${background === "Review" ? "active-btn" : ""}`}>
                    Review
                </button>
            </div>
        </div>
    )
}

export default Navbar