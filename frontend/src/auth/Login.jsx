import { useState } from 'react'
import axios from "axios"
import logo from '../assets/logo.png'
import "./LoginAndSignup.css"
import { useNavigate } from 'react-router-dom'

function Login({ buttonColor }) {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.post("http://localhost:5000/login", {
                email,
                password
            })

            localStorage.setItem("token", data.token)

            navigate("/dashbord")
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div>

            <form className='form' onSubmit={handleLogin}>
                <img src={logo} className='logo' />
                <input className='email' type="email"
                    placeholder='Email'
                    value={email} onChange={(e) => setemail(e.target.value)}
                    required />

                <input className='password' type="password"
                    placeholder='Password'
                    value={password} onChange={(e) => setpassword(e.target.value)}
                    required />

                <button className='submit'
                    style={{ backgroundColor: buttonColor }}
                    type='submit'>Login</button>
            </form>

        </div>
    )
}

export default Login