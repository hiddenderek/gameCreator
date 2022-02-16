import React, {useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router'
import {useAppSelector, useAppDispatch} from '../app/hooks';
import {setSearchTerm, setRankView} from '../features/userInterface/userInterface-slice'
import { handleApiData } from './Apicalls';
import config from '../config';
function Banner ({setProfileData, userData} : any) {
  const history = useHistory()
  const location: any = useLocation()
  const searchTerm = useAppSelector((state) => state.userInterface.searchTerm)
  const rankView = useAppSelector((state)=> state.userInterface.rankView)
  const gameName = useAppSelector((state)=> state.gameData.gameName)
  const dispatch = useAppDispatch()
  useEffect(()=>{
    //when the banner is first mounted, the current location search term is set in the redux state. 
    //This also drives the current games displayed in the game browser, if that page is open.
    if (location.search.includes('&search=')) {
      const getSearch1 = location.search.lastIndexOf('&search=')
      const getSearch2 = location.search.substring(getSearch1)
      const getSearch = getSearch2.split('&search=').join('')
      console.log(getSearch)
      changeSearchTerm(getSearch)
    }
  },[])
  useEffect(()=> {
    changeSearchTerm('')
  }, [location.pathname])
  function signUp(){
    history.push('/signup')
  }
  function logIn() {
    history.push('/login')
  }
  function profileNav() {
    history.push(`/users/${userData.username}`)
  }

  //the search term is set, if the value is either truthy or blank. 
  //Blank is falsy so we have to account for that in the ternary statement.
  function changeSearchTerm(e: any) {
    console.log(e?.target?.value)
    dispatch(setSearchTerm(e?.target?.value || e?.target?.value === "" ? e.target.value : e))
  }
  // handles log outs. Doesnt use the api module, as we need special headers for this.
  async function logOut() {
    console.log('logout')
    try {
      const signUpResult = await fetch(`http://localhost:${config.authPort}/logout`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': `http://localhost:${config.authPort}`
        },
        body: '',
      })
      if (signUpResult.status == 204) {
        setProfileData({ username: "" })
        history.push('/home')
      }
    } catch (e) {
      console.log(e)
    }
  }
  function rateGame(rating : string) {
    handleApiData(`${location.pathname}/actions/${rating}`, null, "post", null)
  
  }
  function changeRankView() {
    if (rankView === false) {
        dispatch(setRankView(true))
    } else if (rankView === true) {
        dispatch(setRankView(false))
    }
  }
  //banner shows different content depending on the location pathname and redux state.
  return (
    <div className="banner">
      {location.pathname.includes('/games') && !location.pathname.includes('/games/') || location.pathname.includes('/users/') ?
        <form className="searchBarForm">
          <input className="searchBarInput" placeholder="Search" onInput={changeSearchTerm} value = {searchTerm}></input>
        </form>
        : ""}
        {location.pathname.includes('/games/') && gameName ?
        <span className = "inlineFlex flexCenter fullHeight absolute gameTitle"><div className = "bannerButton voteText" onClick = {changeRankView}><div className = "height66 autoWidth left autoFitContainer noClick" ><img className = "autoFitContent noClick" src = "/images/trophy.png"/></div><p>&nbsp;&nbsp;Ranks</p></div>	&nbsp;&nbsp;{gameName.toUpperCase()}&nbsp;&nbsp;<div className = "bannerButton voteText" onClick = {()=>{rateGame("like")}}><p>Like</p><img className = "halfHeight autoWidth pixelate noClick"src = "/images/like.png"/></div><div className = "bannerButton voteText" onClick = {()=>{rateGame("dislike")}}><p>Dislike</p><img className = "halfHeight autoWidth pixelate noClick"src = "/images/dislike.png"/></div></span>
        : ""}
      {!userData.username ?
        <>
          <div className="inlineItem right login" onClick={() => { logIn() }}>LOGIN</div>
          <div className="inlineItem right signUp" onClick={() => { signUp() }}>SIGN UP</div>
        </>
        :
        <>
          <div className="inlineItem right login" onClick={() => { profileNav() }}>{userData.username.toUpperCase()}</div>
          <div className="inlineItem right signUp" onClick={() => { logOut() }}>LOG OUT</div>
        </>
      }
    </div>
  );
}

export default Banner