import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import GameIcon from './GameIcon'
import {handleApiData} from '../utils/apicalls';
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
        handleApiData(`/games/${displayedUserName}${location.search}`, setUserGames, "get", null)
    }
    useEffect(() => {
        const oldURL = location.pathname + location.search
        const newURL = location.pathname + `?${(searchTerm || searchTerm == "") ? `search=${searchTerm}` : ""}`
        if (oldURL !== newURL) {
            history.push(newURL)
        } else {
            getData()
        }

    }, [location.search, searchTerm])

    useEffect(() => {
        getData()
    }, [displayedUserName, username, location.search])
    
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
                        <div className="left profileName">{displayedUserName.toUpperCase()}</div>
                        <div className="left profileCaption">User Profile</div>
                    </div>
                </div>
                { displayedUserName === username ? 
                <a data-testid = "profile_create_game" className="right gameButton" onClick={(e)=>{e.preventDefault();createGame();}}>
                    <p className="plusIcon">+</p>
                    <p>CREATE GAME</p>
                </a>
                : ""}
            </div>
            <div className="profileGameLabel center">{displayedUserName === username ?  "YOUR GAMES:" : `${displayedUserName.toUpperCase()}'S GAMES:`}</div>
            <div className="gameBrowserContentContainer profileGameBrowser">
                <div id="gameInfo" className="gameBrowser">{typeof userGames.map == "function" ? userGames?.map((item: gameObject, index) => { console.log(item); return <GameIcon key={item.game_name} index={index}  gameData={item} getData={getData} profileData={profileData}/> }) : ""}</div>
            </div>
        </div>
    );
}

export default UserProfile