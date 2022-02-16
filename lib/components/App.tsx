import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SignUp from './SignUp'
import LogIn from './LogIn'
import Home from './Home'
import UserProfile from './UserProfile'
import GameBrowser from './GameBrowser'
import Game from './Game'
import GameEditor from './GameEditor'
import Banner from './Banner'
import SideBar from './SideBar'
import { handleKeyPress, handleKeyRelease } from './handleKeyPress'
import { useLocation, useHistory } from 'react-router'
import { useAppDispatch} from '../app/hooks';
import {gameEditorReset} from '../features/gameEditor/gameEditor-slice'
import {resetGame} from './GameEvents'
import {setUser} from '../features/userInterface/userInterface-slice';
import {handleApiData } from './Apicalls'
import {event, userObject} from '../app/types'
import Ranks from './Ranks'
import { characterTrack } from './physics';
function App () {

  const [sideBar, setSideBar] = useState(false)
  const defaultProfile: userObject = { username: "" }
  const [profileData, setProfileData] = useState(defaultProfile)
  const location: any = useLocation()
  const history = useHistory()
  const dispatch = useAppDispatch()
  function setCurrentUser (user: string) {
    dispatch(setUser(user))
  }
  //this app initially sets the current user if you were previously logged in. The current user name is stored in httpsonly cookies. 
  //if there is a current user, the app will change the UI state to your user and populate the page with relevant data.
  useEffect(() => {
    if (location.pathname == "/") {
      history.push('/home')
    }
    getData()
    async function getData() {
      console.log('currentuserer!')
      let currentUser = await handleApiData(`/currentUser`, setCurrentUser, "get", null)
      if (!currentUser) {
        currentUser = await handleApiData(`/currentUser`, setCurrentUser, "get", null)
      }
      if (currentUser) {
        console.log('THE CURRENT USER IS: ' + `/users/${currentUser}`)
        const result = await handleApiData(`/users/${currentUser}`, setProfileData, "get", null)
        console.log(result)
      }
    }
  }, [])

  // retrieves data from the api. If the path parameter is falsy. 
  // This function accepts 4 parameters: The api endpoint, a callback function to run after the respones from the server, the type of request, and the body content to supply. 
  // if the api endpoint is not supplied, it defaults to the current endpoint.
  // api handling is handled in a seperate 'api calls' module.
  // each time the app reloads, it will check to see if you're playing a game. 
  // the /games/ and /gameEditor/ endpoints always contain games in their pages, so this is a good way to check.
  // if you're not playing a game, the app will reset all game state and intervals.
  useEffect(() => {
    console.log('resetGame!')
    if (!location.pathname.includes('/games/')  && !location.pathname.includes('/gameEditor/')) {
    resetGame()
    setSideBar(false)
    } else if (location.pathname.includes('/games/')) {
      dispatch(gameEditorReset())
    }
  },[location])
  console.log('resetgmae!')
  console.log(profileData.username)
  console.log('hi')
  //several key  events are set on loading the app. These are handled in a seperate key handler module.
  function keyPress(e: event) {
    console.log('key')
    handleKeyPress(e)
  }
  function keyRelease(e: event) {
    handleKeyRelease(e)
  }
  function turnOnSideBar() {
    console.log('sideBarTurnedOn!!')
    setSideBar(true)
  }

  console.log(sideBar)
  return (
    <div className={sideBar === true ? "appContainer" : "appContainer noSideBar"} tabIndex={0} onKeyDown={(e: any)=>{keyPress(e)}} onKeyUp={(e: any)=>{keyRelease(e)}}>
      <Banner  userData = {profileData.username ? profileData : ""} setProfileData = {setProfileData} />
      <SideBar />
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/LogIn">
          <LogIn  setProfileData = {setProfileData}/>
        </Route>
        <Route path="/gameEditor">
          <Game profileData = {profileData as userObject} />
          <GameEditor turnOnSideBar={turnOnSideBar}  profileData = {profileData}/>
        </Route>
        <Route path="/games/:userName/:gameName">
          <Game profileData = {profileData as userObject} />
        </Route>
        <Route path="/games">
          <GameBrowser />
        </Route>
        <Route path="/users">
          <UserProfile userData = {profileData.username ? profileData : ""}/>
        </Route>
        <Route path="/home" >
          <Home />
        </Route>
        <Route path="/rankings" >
          <Ranks />
        </Route>
      </Switch>
    </div>
  );
}

export default App