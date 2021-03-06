import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { handleApiData } from '../utils/apicalls';

function GameIcon({ index, gameData, profileData, getData }: any) {
    const { username } = profileData
    const history = useHistory()
    const location = useLocation()
    const [gameUserName, setGameUserName] = useState('')
    const [gameLikes, setGameLikes] = useState(0)
    const [gameDislikes, setGameDislikes] = useState(0)

    useEffect(() => {
        getUserName(gameData.user_id)
        getGameLikes()
        getGameDislikes()
    }, [])

    useEffect(() => {
        getGameLikes()
        getGameDislikes()
    }, [gameUserName])

    async function navigateToGame(gameName: string) {
        history.push(`/games/${gameUserName}/${gameName}`)
    }

    async function navigateToUser(userName: string) {
        history.push(`/users/${userName}`)
    }

    async function getUserName(userId: string) {
        try {
            const userObj = await handleApiData(`/users/${userId}`, null, "get", null)
            setGameUserName(userObj?.data?.username)
        } catch (e) {
            console.error("GET USER ERROR: " + e)
        }
    }
    async function getGameLikes() {
        try {
            if (gameUserName) {
                handleApiData(`/games/${gameUserName}/${gameData.game_name}/actions/like`, setGameLikes, "get", null)
            }
        } catch (e) {
            console.error('ERROR GETTING LIKES: ' + e)
        }
    }

    async function getGameDislikes() {
        try {
            if (gameUserName) {
                handleApiData(`/games/${gameUserName}/${gameData.game_name}/actions/dislike`, setGameDislikes, "get", null)
            }
        } catch (e) {
            console.error('ERROR GETTING DISLIKES: ' + e)
        }
    }

    async function deleteGame() {
        if (location.pathname == `/users/${username}` && confirm("Are you sure you want to delete this game?") === true) {
            try {
                await handleApiData(`/games/${username}/${gameData.game_name}`, null, "delete", { screen: "", mode: "game" })
                getData()
            } catch (e) {
                console.error('Error deleting game: ' + e)
            }
        }
    }

    async function editGame() {
        if (location.pathname == `/users/${username}`) {
            history.push(`/gameEditor/${username}/${gameData.game_name}`)
        }
    }

    return (
        <div data-testid="game_icon" id="gameIcon" className="gameIcon" >
            <img className="absolute topLeft fullWidth fullHeight" src='/images/background_sunset.png' style={{ zIndex: -1 }} />
            <img className="absolute topLeft fullWidth fullHeight click" src={gameData.grid_image} style={{ zIndex: -1 }} />
            <p data-testid={`game_icon_plays_${index}`} className="left gameStat ">PLAYS:&nbsp; {gameData.plays}</p>
            <p data-testid="game_icon_dislikes" className="right gameStat"><img className="smallLike" src="/images/dislike.png" />{gameDislikes}</p>
            <p data-testid="game_icon_likes" className="right gameStat"><img className="smallLike" src="/images/like.png" />{gameLikes}</p>
            <p data-testid={`game_icon_name_${index}`} className="flexCenter absolute fullWidth iconText" >{gameData?.game_name?.toUpperCase()}</p>
            <p data-testid={`game_icon_user_${index}`} className="bottom center absolute iconText userText" onClick={() => { navigateToUser(gameUserName) }}>&nbsp; By: {`${gameUserName}`}</p>
            {location.pathname == `/users/${username}` ? <div className="editIcon" onClick={() => { editGame() }}><img className="fullHeight fullWidth" src="/images/pencil.png" /></div> : ""}
            {location.pathname == `/users/${username}` ? <div data-testid={`game_icon_delete_${index}`} className="deleteIcon" onClick={() => { deleteGame() }}>X</div> : ""}
            <a data-testid="game_icon_navigate" className="absolute topLeft fullWidth fullHeight gameEffect" onClick={(e) => { e.preventDefault(); navigateToGame(gameData.game_name) }}></a>
        </div>
    );
}

export default GameIcon