import { useState } from 'react'
import axios from "axios"
import logo from '../assets/logo.png'
import "./LoginAndSignup.css"
import { useNavigate } from 'react-router-dom'

function Signup({ buttonColor }) {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("Sending signup request...");

        try {
            const { data } = await axios.post("http://localhost:5000/signup", {
                email,
                password
            });

            console.log("Signup success:", data);
            localStorage.setItem("token", data.token);

            navigate("/dashbord")
        } catch (error) {
            console.log("Signup error:", error);

        }
    }

    return (
        <div>

            <form className="form" onSubmit={handleSignup}>
                <img src={logo} className='logo' />
                <input className='email' type="email"
                    placeholder='Email'
                    value={email} onChange={(e) => setemail(e.target.value)}
                    required />

                <input className='password' type="password"
                    placeholder='Password'
                    value={password} onChange={(e) => setpassword(e.target.value)}
                    required />

                <button className="submit"
                    style={{ backgroundColor: buttonColor }}
                    type='submit'>Signup</button>
            </form>

        </div>
    )
}

export default Signup