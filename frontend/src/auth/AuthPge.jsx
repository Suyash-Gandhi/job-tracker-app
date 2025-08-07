import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import "./LoginAndSignup.css"
import { useEffect } from 'react'

function AuthPage() {
  const [click, setclick] = useState("signup")
  const gradients = {
    signup: {
      background: "linear-gradient(to right, #ffecd2, #fcb69f)",
      button: "#fcb69f"
    },
    login: {
      background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
      button: "#74ebd5"
    }
  }

  useEffect(() => {
    const root = document.querySelector(".outer-wrapper");
    root.style.background = gradients[click].background;
  }, [click]);


  return (
    <>
      <div className="outer-wrapper">
        <div className="button">
          <button
            className={`login ${click === 'login' ? 'active-btn' : ''}`}
            onClick={() => setclick('login')}
            style={{ backgroundColor: click === 'login' ? gradients.login.button : 'white' }}
          >
            Signup
          </button>
          <button
            className={`signup ${click === 'signup' ? 'active-btn' : ''}`}
            onClick={() => setclick('signup')}
            style={{ backgroundColor: click === 'signup' ? gradients.signup.button : 'white' }}
          >
            Login
          </button>
        </div>


        <div className={`card-container ${click === 'signup' ? 'flip' : ''}`}>
          <div className="card">
            <div className="card-face front">
              <Signup buttonColor={gradients[click].button}/>
            </div>
            <div className="card-face back">
              <Login buttonColor={gradients[click].button}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthPage