import React, { useState } from 'react'
import config from '../config'
import { useHistory } from 'react-router-dom';

function SignUp() {
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
  async function signUp() {
    if (passwordMatch === 'Passwords match!' && userName && dateOfBirth) {
      const signUpResult = await fetch(`http://localhost:${config.port}/api/users/${userName}`, {
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
    setUserName(e.target.value)
  }
  function specifyPassword(e: any) {
    setPassword(e.target.value)
    if (e.target.value !== confirmPassword) {
      setPasswordMatch('Error: Passwords do not match.')
    } else if (e.target.value === confirmPassword) {
      setPasswordMatch('Passwords match!')
    }
  }
  function specifyConfirmPassword(e: any) {
    setConfirmPassword(e.target.value)
    if (e.target.value !== password) {
      setPasswordMatch('Error: Passwords do not match.')
    } else if (e.target.value === password) {
      setPasswordMatch('Passwords match!')
    }
  }
  function specifyDateOfBirth(e: any) {
    setDateOfBirth(e.target.value)
  }
  function profileNavigate() {
    history.push(`/login`)
  }
  return (
    <div className="content">
      <div className="signUpPopup">
        <div className="popupHeader" >Sign Up</div>
        <form className="singleLine"><label>User Name: </label><input type="text" onInput={specifyUserName} ></input></form>
        <form className="singleLine"><label>Password: </label><input type="password" onInput={specifyPassword}></input></form>
        <form className="singleLine"><label>Confirm Password: </label><input type="password" onInput={specifyConfirmPassword}></input></form>
        <div className="singleLine"><div className="center">{passwordMatch}</div></div>
        <form className="singleLine"><label>Date of Birth: </label><input type="date" onInput={specifyDateOfBirth}></input></form>
        <div className="singleLine"><div className="center">{dateOfBirth ? "Date of birth specified!" : "No date of birth specified."}</div></div>
        <div className="singleLine"><button className={passwordMatch != "Passwords match!" || !dateOfBirth || !userName ? "inactiveButton center" : "activeButton center"} onClick={signUp}>Submit</button></div>
        {signUpOutcome ? <div className="singleLine"><p className="center">Sign up result: {signUpOutcome}</p></div> : ""}
        {signUpOutcome.includes('Successful') ? <div className="singleLine"><button className="center" onClick={profileNavigate}>Continue to login</button></div> : ""}
      </div>
    </div>
  );
}

export default SignUp