import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar/Navbar.jsx"
import Jobs from "./components/jobs/Jobs"
import Connections from "./components/Connections"
import Schedule from "./components/Schedule"
import Analytics from "./components/Analytics"
import Review from "./components/Review"

function Dashbord() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route index element={<Jobs />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="connections" element={<Connections />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="review" element={<Review />} />
      </Routes>
      
    </div>
  )
}

export default Dashbord