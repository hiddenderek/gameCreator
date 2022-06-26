declare const window: Window & { gameAudio : any }
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
import { handleKeyPress, handleKeyRelease } from '../utils/handleKeyPress'
import { useLocation, useHistory } from 'react-router'
import { useAppDispatch} from '../app/hooks';
import {gameEditorReset} from '../features/gameEditor/gameEditor-slice'
import {resetGame} from './GameEvents'
import {handleApiData} from '../utils/apicalls';
import {userObject} from '../app/types'
import Ranks from './Ranks'

function App () {
  const [sideBar, setSideBar] = useState(false)
  const defaultProfile: userObject = { username: "" }
  const [profileData, setProfileData] = useState(defaultProfile)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [sideBarCheck, setSideBarCheck] = useState(false)
  const [doubleBannerCheck, setDoubleBannerCheck] = useState(false)
  const location: any = useLocation()
  const history = useHistory()
  const dispatch = useAppDispatch()
  //this app initially sets the current user if you were previously logged in. The current user name is stored in httpsonly cookies. 
  //if there is a current user, the app will change the UI state to your user and populate the page with relevant data.
  useEffect(() => {
    if (location.pathname == "/") {
      history.push('/home')
    }
    //gets the current user, then gets the relevant profile data if applicable. Then sets the state with this data.
    getData()
    //fixes vh inconsistencies on mobile, runs when app component is mounted. 
    if (typeof document !== "undefined") {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      //makes sure the vh unit is updated on a window resize.
      window.addEventListener('resize', () => {
        // We execute the same script as before
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      })
      window.gameAudio = {}
      window.gameAudio.gameMusic_1 = new Audio('/sounds/gameMusic_1.wav')
    }
  }, [])

  async function getData() {
    try {
      let currentUser = await handleApiData(`/currentUser`, null, "get", null)

      if (currentUser?.status === 200){
          handleApiData(`/users/${currentUser?.data}`, setProfileData, "get", null)
      }
    } catch (e) {
      console.error('Error getting user: ' + e)
    }
  }

  useEffect(()=>{
    //checks to see what type of device you're using, and what the aspect ratio is. Updates state based on this information.
    const ua = typeof navigator !== "undefined" ? navigator?.userAgent : "desktop";
    const aspectRatio = screen.width/screen.height
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua)
    const sideBarCheck = (sideBar === false)
    const doubleBannerCheck = (isMobile === true && aspectRatio < 1 && location.pathname.includes('/games/'))
    setAspectRatio(aspectRatio)
    setIsMobile(isMobile)
    setSideBarCheck(sideBarCheck)
    setDoubleBannerCheck(doubleBannerCheck)
  },[location.pathname, sideBar,  typeof screen !== "undefined" ? screen.height : 1920, typeof screen !== "undefined" ? screen.width : 1080])



  // retrieves data from the api. If the path parameter is falsy. 
  // This function accepts 4 parameters: The api endpoint, a callback function to run after the respones from the server, the type of request, and the body content to supply. 
  // if the api endpoint is not supplied, it defaults to the current endpoint.
  // api handling is handled in a seperate 'api calls' module.
  // each time the app reloads, it will check to see if you're playing a game. 
  // the /games/ and /gameEditor/ endpoints always contain games in their pages, so this is a good way to check.
  // if you're not playing a game, the app will reset all game state and intervals.
  useEffect(() => {
    const audio = window.gameAudio.gameMusic_1
    if (!location.pathname.includes('/games/')  && !location.pathname.includes('/gameEditor/')) {
    resetGame()
    setSideBar(false)
    } else if (location.pathname.includes('/games/')) {
      dispatch(gameEditorReset())
    }
    //handles pausing and playing audio depending on endpoint location.
    if (!location.pathname.includes('/games/')) {
      audio.pause()
      audio.currentTime = 0
    } else if (location.pathname.includes('/games/')) {
      audio.autoplay = true
      audio.muted = false
      audio.loop = true
      audio.play()
    }
  },[location.pathname])
  //several key events are set on loading the app. These are handled in a seperate key handler module.
  function keyPress(e: KeyboardEvent) {
    handleKeyPress(e)
  }
  function keyRelease(e: KeyboardEvent) {
    handleKeyRelease(e)
  }
  function turnOnSideBar() {
    setSideBar(true)
  }

  const appClasses = `appContainer ${sideBarCheck ? "noSideBar" : ""} ${doubleBannerCheck ? "doubleBanner" : ""}`

  return (
    <div className={appClasses} tabIndex={0} onKeyDown={(e: any)=>{keyPress(e)}} onKeyUp={(e: any)=>{keyRelease(e)}}>
      <Banner  profileData = {profileData as userObject} setProfileData = {setProfileData} aspectRatio = {aspectRatio} isMobile = {isMobile}/>
      <SideBar profileData = {profileData as userObject}/>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/LogIn">
          <LogIn  setProfileData = {setProfileData}/>
        </Route>
        <Route path="/gameEditor">
          <Game profileData = {profileData as userObject} aspectRatio = {aspectRatio} isMobile = {isMobile}/>
          <GameEditor turnOnSideBar={turnOnSideBar}  profileData = {profileData}/>
        </Route>
        <Route path="/games/:userName/:gameName">
          <Game profileData = {profileData as userObject} aspectRatio = {aspectRatio} isMobile = {isMobile} />
        </Route>
        <Route path="/games">
          <GameBrowser profileData = {profileData as userObject}/>
        </Route>
        <Route path="/users">
          <UserProfile profileData = {profileData as userObject}/>
        </Route>
        <Route path="/home" >
          <Home profileData = {profileData as userObject}/>
        </Route>
        <Route path="/rankings" >
          <Ranks />
        </Route>
      </Switch>
    </div>
  );
}

export default App