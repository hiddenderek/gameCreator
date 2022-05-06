import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getAccessToken, getApiData, handleApiData } from './Apicalls'
import config from '../config'
function GameIcon({gameData, profileData, getData} : any) {
    const {username} = profileData
    const history = useHistory()
    const location = useLocation()
    const [gameUserName, setGameUserName] = useState('')
    const [gameLikes, setGameLikes] = useState(0)
    const [gameDislikes, setGameDislikes] = useState(0)
    useEffect(()=>{
        getUserName(gameData.user_id) 
        getGameLikes()
        getGameDislikes()
    },[])
    useEffect(()=>{
        getGameLikes()
        getGameDislikes()
    }, [gameUserName])
    console.log(gameUserName)
    console.log("render game: " + gameData.game_name )

    async function navigateToGame(gameName : string) {
        history.push(`/games/${gameUserName}/${gameName}`)
        console.log(`/games/${gameUserName}/${gameName}`)
    }

    async function navigateToUser(userName:string) {
        history.push(`/users/${userName}`)
    }
    async function getUserName(userId : string) {
        try {
            const userObj = await handleApiData(`/users/${userId}`, null,  "get", null)
            console.log(userObj)
            setGameUserName(userObj?.data?.username)
        } catch (e) {
            console.log("GET USER ERROR: " + e)
        }
    }
    async function getGameLikes() {
        try {
            if (gameUserName) {
            console.log(`/games/${gameUserName}/${gameData.game_name}/actions/like`)
            handleApiData(`/games/${gameUserName}/${gameData.game_name}/actions/like`, setGameLikes, "get", null)
            }
        } catch (e) {
            console.log('ERROR GETTING LIKES: ' + e)
        }
    }
    async function getGameDislikes() {
        try {
            if (gameUserName) {
            handleApiData(`/games/${gameUserName}/${gameData.game_name}/actions/dislike`, setGameDislikes, "get", null)
            }
        } catch (e) {
            console.log('ERROR GETTING DISLIKES: ' + e)
        }
    }

    async function deleteGame() {
        
        if (location.pathname == `/users/${username}` && confirm("Are you sure you want to delete this game?") === true) {
            try {
                const deleteGame = await handleApiData(`/games/${username}/${gameData.game_name}`, null,  "delete", {screen: "", mode: "game"})
                console.log(deleteGame)
                getData()
            } catch (e) {
                console.log(e)
            }
        }
    }
    async function editGame(){
        if (location.pathname == `/users/${username}`) {
            history.push(`/gameEditor/${username}/${gameData.game_name}`)
        }
    }
    console.log('GAME ICON: ' + gameData.game_name)
    console.log(location.pathname)
    console.log(gameUserName)
    console.log(`/users/${username}`)
    return (
        <div id="gameIcon" className="gameIcon" >
            <img className = "absolute topLeft fullWidth fullHeight"  src = '/images/background_sunset.png' style = {{zIndex: -1}}/>
            <img className = "absolute topLeft fullWidth fullHeight click"  src = {gameData.grid_image} style = {{zIndex: -1}} />
            <p className = "left gameStat ">PLAYS:&nbsp; {gameData.plays}</p>
            <p className = "right gameStat"><img className = "smallLike" src = "/images/dislike.png"/>{gameDislikes}</p>
            <p className = "right gameStat"><img className = "smallLike" src = "/images/like.png"/>{gameLikes}</p>
            <p className = "flexCenter absolute fullWidth iconText" >{gameData.game_name.toUpperCase()}</p>
            <p className = "bottom center absolute iconText userText" onClick = {()=>{navigateToUser(gameUserName)}}>&nbsp; By: {`${gameUserName}`}</p>
            {location.pathname == `/users/${username}` ? <div className = "editIcon" onClick = {()=>{editGame()}}><img className = "fullHeight fullWidth" src = "/images/pencil.png"/></div> : ""}
            {location.pathname == `/users/${username}` ? <div className = "deleteIcon" onClick = {()=>{deleteGame()}}>X</div> : ""}
            <div className = "absolute topLeft fullWidth fullHeight gameEffect" onClick = {()=>{navigateToGame(gameData.game_name)}}></div>
        </div>
    );
}

export default GameIcon