import React, { useEffect, useState } from 'react';
import {handleApiData} from '../utils/apicalls';
import {useHistory} from 'react-router-dom'
import {userData} from '../app/types'

function Ranks () {
    const [highScoreRanks, setHighScoreRanks] = useState([])
    const [likeRanks, setLikeRanks] = useState([])
    const [playRanks, setPlayRanks] = useState([])
    const history = useHistory()

    useEffect(()=>{
        handleApiData(`/ranks/scores`, setHighScoreRanks, "get", null)
        handleApiData(`/ranks/likes`, setLikeRanks, "get", null)
        handleApiData(`/ranks/plays`, setPlayRanks, "get", null)
    },[])

    async function navigateToUser(userName: string) {
        history.push(`/users/${userName}`)
    }

    return (
        <div className="ranks scrollContent" >
            <div className = "rankSection">
                <h1 className = "fullWidth flexCenter smallHeight rankLabel">HIGH SCORES ACHIEVED</h1>            
                <ul>{typeof highScoreRanks.map === "function" ? 
                    highScoreRanks.map((item: userData, index)=> {
                        return <li key = {"High Score Rank " + index} className = "rankEntry">
                                <a data-testid = {`high_score_rank_${index}`} className = "userText" onClick = {(e)=>{e.preventDefault(); navigateToUser(item.username)}}>{`${index + 1}: ${item.username}`}</a>
                                <p className = "right">{`${item.score_count} high scores`}</p>
                            </li>}) : ""}
                </ul>  
            </div>
            <div className = "rankSection">
                <h1 className = "fullWidth flexCenter smallHeight rankLabel">LIKES RECIEVED</h1>
                <ul>{typeof likeRanks.map === "function" ? 
                    likeRanks.map((item: userData, index)=> {
                        return <li key = {"Like Rank " + index} className = "rankEntry">
                                <a data-testid = {`likes_rank_${index}`} className = "userText" onClick = {(e)=>{e.preventDefault(); navigateToUser(item.username)}}>{`${index + 1}: ${item.username}`}</a>
                                <p className = "right">{`${item.total_score} likes`}</p>
                            </li>}) : ""}
                </ul>  
            </div>
            <div className="rankSection">
                <h1 className="fullWidth flexCenter smallHeight rankLabel">PLAYS RECIEVED </h1>
                <ul>{typeof playRanks.map === "function" ?
                    playRanks.map((item: userData, index) => {
                        return <li key = {"Play Rank " + index} className="rankEntry">
                                <a data-testid = {`plays_rank_${index}`} className="userText" onClick={(e) => {e.preventDefault(); navigateToUser(item.username) }}>{`${index + 1}: ${item.username}`}</a>
                                <p className="right">{`${item.play_count} plays`}</p>
                            </li>}) : ""}
                </ul>
            </div>
        </div>
    );
}

export default Ranks