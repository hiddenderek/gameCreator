import React, { useRef, useEffect, useState, useReducer } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import GameIcon from './GameIcon'
import { handleApiData } from './Apicalls';
import {userObject} from '../app/types'
function UserProfile ({profileData}: {profileData: userObject}) {
    const {username} = profileData
    const history = useHistory()
    const searchTerm = useAppSelector((state) => state.userInterface.searchTerm)
    const [userGames , setUserGames] = useState([])
    interface gameObject {
        game_name: string
    }
    const displayedUserName = location.pathname.split('/users/').join('')

    async function getData() {
        console.log("SEARCH: "+ `/games/${displayedUserName}${location.search}`)
        const gameResponse = await handleApiData(`/games/${displayedUserName}${location.search}`, setUserGames, "get", null)
        console.log(gameResponse)
        if (gameResponse?.status === 200){
            setUserGames(gameResponse?.data)
        }
    }
    useEffect(() => {
        console.log('reload')
        const oldURL = location.pathname + location.search
        const newURL = location.pathname + `?${(searchTerm || searchTerm == "") ? `search=${searchTerm}` : ""}`
        console.log(oldURL)
        console.log(newURL)
        if (oldURL !== newURL) {
            console.log('urlChange')
            history.push(newURL)
        } else {
            getData()
        }

    }, [location.search, searchTerm])

    useEffect(() => {
        getData()
    }, [displayedUserName, username, location.search])
    
    console.log("userName: " + username)
    function createGame() {
        history.push(`/gameEditor/${username}/new`)
    }
    return (
        <div id="userProfile" className="userProfile content">
            <div id="userInfo" className="userInfo">
                <div className="profileContainer">
                    <div className="profileIcon">
                        <img className = "fullHeight fullWidth" src = "/images/profile.png" />
                    </div>
                    <div className="profileText">
                        <div className="left profileName">{displayedUserName}</div>
                        <div className="left">User Profile</div>
                    </div>
                </div>
                { displayedUserName === username ? 
                <div className="right gameButton" onClick={createGame}>
                    <p className="plusIcon">+</p>
                    <p>Create Game</p>
                </div>
                : ""}
            </div>
            <div className="profileGameLabel center">{displayedUserName === username ?  "Your Games:" : `${displayedUserName}'s Games:`}</div>
            <div className="gameBrowserContentContainer profileGameBrowser">
                <div id="gameInfo" className="gameBrowser">{typeof userGames.map == "function" ? userGames?.map((item: gameObject) => { console.log(item); return <GameIcon key={item.game_name} gameData={item} getData={getData} profileData={profileData}/> }) : ""}</div>
            </div>
        </div>
    );
}

export default UserProfile