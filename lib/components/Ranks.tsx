import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router'
import { handleApiData } from './Apicalls';
function Ranks () {
    const [highScoreRanks, setHighScoreRanks] = useState([])
    const [likeRanks, setLikeRanks] = useState([])
    const [playsRanks, setPlaysRanks] = useState([])
    type userData = {
        username: string,
        total_score: number,
        score_count: number
        play_count: number
    }
    useEffect(()=>{
        handleApiData(`/ranks/scores`, setHighScoreRanks, "get", null)
        handleApiData(`/ranks/likes`, setLikeRanks, "get", null)
        handleApiData(`/ranks/plays`, setPlaysRanks, "get", null)
    },[])
    console.log('homeRender!')
    return (
        <div className="ranks content" >
            <div className = "rankSection">
                <h1 className = "fullWidth flexCenter smallHeight rankLabel">HIGH SCORES ACHIEVED</h1>            
                <ul>{highScoreRanks.map((item: userData, index)=><li className = "rankEntry"><p>{`${index + 1}: ${item.username}`}</p><p className = "right">{`${item.score_count} high scores`}</p></li>)}</ul>  
            </div>
            <div className = "rankSection">
                <h1 className = "fullWidth flexCenter smallHeight rankLabel">LIKES RECIEVED</h1>
                <ul>{likeRanks.map((item: userData, index)=><li className = "rankEntry"><p>{`${index + 1}: ${item.username}`}</p><p className = "right">{`${item.total_score} likes`}</p></li>)}</ul>  
            </div>
            <div className = "rankSection">
                <h1 className = "fullWidth flexCenter smallHeight rankLabel">PLAYS RECIEVED </h1>
                <ul>{playsRanks.map((item: userData, index)=><li className = "rankEntry"><p>{`${index + 1}: ${item.username}`}</p><p className = "right">{`${item.play_count} plays`}</p></li>)}</ul>  
            </div>
        </div>
    );
}

export default Ranks