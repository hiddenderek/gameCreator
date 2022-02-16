import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getAccessToken, getApiData, handleApiData } from './Apicalls'
import config from '../config'
function GameIcon(props: any) {
    const history = useHistory()
    const location = useLocation()
    const [userName, setUserName] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [gameLikes, setGameLikes] = useState(0)
    const [gameDislikes, setGameDislikes] = useState(0)
    useEffect(()=>{
        getCurrentUser()
        getUserName(props.gameData.user_id) 
        getGameLikes()
        getGameDislikes()
    },[])
    useEffect(()=>{
        getGameLikes()
        getGameDislikes()
    }, [userName])
    console.log(userName)
    async function getCurrentUser() {
        let currentUser = await handleApiData(`/currentUser`, null, "get", null)
        console.log(currentUser)
        if (currentUser == undefined) {
            currentUser = await handleApiData(`/currentUser`, null, "get", null)
            console.log(currentUser)
        }
        setCurrentUser(currentUser)
    }


    async function navigateToGame(gameName : string) {
        history.push(`/games/${userName}/${gameName}`)
        console.log(`/games/${userName}/${gameName}`)
    }
    async function getUserName(userId : string) {
        try {
            const userObj = await handleApiData(`/users/${userId}`, null,  "get", null)
            console.log(userObj)
            setUserName(userObj.username)
        } catch (e) {
            console.log("GET USER ERROR: " + e)
        }
    }
    async function getGameLikes() {
        try {
            if (userName) {
            console.log(`/games/${userName}/${props.gameData.game_name}/actions/like`)
            handleApiData(`/games/${userName}/${props.gameData.game_name}/actions/like`, setGameLikes, "get", null)
            }
        } catch (e) {
            console.log('ERROR GETTING LIKES: ' + e)
        }
    }
    async function getGameDislikes() {
        try {
            handleApiData(`/games/${userName}/${props.gameData.game_name}/actions/dislike`, setGameDislikes, "get", null)
        } catch (e) {
            console.log('ERROR GETTING DISLIKES: ' + e)
        }
    }

    async function deleteGame() {
        
        if (location.pathname == `/users/${currentUser}` && confirm("Are you sure you want to delete this game?") === true) {
            try {
                const deleteGame = await handleApiData(`/games/${currentUser}/${props.gameData.game_name}`, null,  "delete", {screen: "", mode: "game"})
                console.log(deleteGame)
                props.getData()
            } catch (e) {
                console.log(e)
            }
        }
    }
    async function editGame(){
        if (location.pathname == `/users/${currentUser}`) {
            history.push(`/gameEditor/${currentUser}/${props.gameData.game_name}`)
        }
    }
    console.log(location.pathname)
    return (
        <div id="gameIcon" className="gameIcon" >
            <img className = "absolute topLeft fullWidth fullHeight" src = '/images/background_sunset.png' style = {{zIndex: -1}}/>
            <img className = "absolute topLeft fullWidth fullHeight" src = {props.gameData.grid_image} style = {{zIndex: -1}}/>
            <p className = "left gameStat ">PLAYS:&nbsp; {props.gameData.plays}</p>
            <p className = "right gameStat"><img className = "smallLike" src = "/images/dislike.png"/>{gameDislikes}</p>
            <p className = "right gameStat"><img className = "smallLike" src = "/images/like.png"/>{gameLikes}</p>
            <p className = "flexCenter absolute fullWidth iconText" onClick = {()=>{navigateToGame(props.gameData.game_name)}}>{props.gameData.game_name.toUpperCase()}</p>
            <p className = "bottom flexCenter absolute fullWidth iconText">&nbsp; By: {`${userName}`}</p>
            {location.pathname == `/users/${currentUser}` ? <div className = "editIcon" onClick = {()=>{editGame()}}><img className = "fullHeight fullWidth" src = "/images/pencil.png"/></div> : ""}
            {location.pathname == `/users/${currentUser}` ? <div className = "deleteIcon" onClick = {()=>{deleteGame()}}>X</div> : ""}
            <div className = "absolute topLeft fullWidth fullHeight gameEffect"></div>
        </div>
    );
}

export default GameIcon