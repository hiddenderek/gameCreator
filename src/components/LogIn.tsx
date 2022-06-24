import React, { useState } from 'react'
import config from '../config'
import { useLocation, useHistory } from 'react-router-dom';
import {handleApiData} from '../utils/apicalls';

function LogIn({setProfileData} : any) {
  const location = useLocation()
  const history = useHistory()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [signUpOutcome, setSignUpOutcome] = useState('')
  const userData = {
    username: userName,
    password: password
  }
  async function logIn(e:any) {
    e.preventDefault()
    try {
      const signUpResult = await fetch(`https://${config.hostname}:${config.authPort}/login`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials' : 'true',
          'Access-Control-Allow-Origin' : `https://${config.hostname}:${config.authPort}`
        },
        body: JSON.stringify(userData),
      })
      const signUpResult2 = await signUpResult.text()
      setSignUpOutcome(signUpResult2.split("\"").join(""))
      if (signUpResult2.split("\"").join("").includes("Login successful!")) {
        handleApiData(`/users/${userData.username}`, setProfileData, "get", null)
      }
    } catch (e) {
      console.error('Login Error: ' + e)
    }
  }

  function specifyUserName(e: any) {
    setUserName(e.target.value)
  }
  function specifyPassword(e: any) {
    setPassword(e.target.value)
  }
  function profileNavigate() {
    history.push(`/users/${userName}`)
  }
  return (
    <div className="content">
      <div className="signUpPopup">
        <div className="popupHeader">Log in</div>
        <div className = "fullWidth">
          <div className="singleLine">
            <label>User Name: </label>
            <input data-testid = "user_login_input" type="text" onInput={specifyUserName} ></input>
          </div>
          <div className="singleLine">
            <label>Password: </label>
            <input data-testid = "pswd_login_input" type="password" onInput={specifyPassword}></input>
          </div>
        </div>
        <form className="singleLine" onSubmit={(e) => { logIn(e) }}>
          <button data-testid = "log_in_button" className={!userName || !password ? "inactiveButton center" : "activeButton center"}>Log In</button>
        </form>
        {signUpOutcome ? 
          <div className="singleLine"><div className="center">Log in result: {signUpOutcome}</div></div> : ""}
        {signUpOutcome.includes("Login successful!") ? 
          <div className="singleLine"><button className = "center" onClick = {profileNavigate}>Continue to profile page.</button>
          </div>: ""}
    </div>
  </div>
 
  );
}

export default LogIn