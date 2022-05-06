import React, { useState } from 'react'
import config from '../config'
import { useLocation, useHistory } from 'react-router-dom';

function SignUp() {
  const location = useLocation()
  const history = useHistory()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState('No password Entered.')
  const [signUpOutcome, setSignUpOutcome] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const userData = {
    password: password,
    dateOfBirth: dateOfBirth
  }
  async function signUp(e:any) {
    e.preventDefault()
    if (passwordMatch === 'Passwords match!' && userName && dateOfBirth) {
      const signUpResult = await fetch(`https://${config.hostname}:${config.port}/api/users/${userName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      })
      const signUpResult2 = await signUpResult.text()
      setSignUpOutcome(signUpResult2.split("\"").join(""))
    } else {
      console.log(passwordMatch)
    }
  }

  function specifyUserName(e: any) {
    e.preventDefault()
    setUserName(e.target.value)
  }
  function specifyPassword(e: any) {
    e.preventDefault()
    setPassword(e.target.value)
    if (e.target.value !== confirmPassword) {
      setPasswordMatch('Error: Passwords do not match.')
    } else if (e.target.value === confirmPassword) {
      setPasswordMatch('Passwords match!')
    }
  }
  function specifyConfirmPassword(e: any) {
    e.preventDefault()
    setConfirmPassword(e.target.value)
    if (e.target.value !== password) {
      setPasswordMatch('Error: Passwords do not match.')
    } else if (e.target.value === password) {
      setPasswordMatch('Passwords match!')
    }
  }
  function specifyDateOfBirth(e: any) {
    e.preventDefault()
    setDateOfBirth(e.target.value)
  }
  function profileNavigate() {
    history.push(`/login`)
  }
  return (
    <div className="content">
      <div className="signUpPopup">
        <h1 className="popupHeader" >Sign Up</h1>
        <div className="singleLine">
          <label>User Name: </label><input type="text" onInput={specifyUserName} ></input>
        </div>
        <div className="singleLine">
          <label>Password: </label>
          <input type="password" onInput={specifyPassword}></input>
        </div>
        <div className="singleLine">
          <label>Confirm Password: </label>
          <input type="password" onInput={specifyConfirmPassword}></input>
        </div>
        <div className="singleLine">
          <div className="center">{passwordMatch}</div>
        </div>
        <div className="singleLine">
          <label>Date of Birth: </label>
          <input type="date" onInput={specifyDateOfBirth}></input>
        </div>
        <div className="singleLine">
          <div className="center">{dateOfBirth ? "Date of birth specified!" : "No date of birth specified."}</div>
        </div>
        <form className="singleLine" onSubmit={(e)=>{signUp(e)}}>
          <button className={passwordMatch != "Passwords match!" || !dateOfBirth || !userName ? "inactiveButton center" : "activeButton center"}>Submit</button>
        </form>
        {signUpOutcome ?
          <div className="singleLine">
            <p className="center">Sign up result: {signUpOutcome}</p>
          </div> : ""}
        {signUpOutcome.includes('Successful') ? 
        <div className="singleLine">
          <button className="center" onClick={profileNavigate}>Continue to login</button>
        </div> : ""}
      </div>
    </div>
  );
}

export default SignUp