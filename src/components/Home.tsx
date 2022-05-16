import React, { useEffect, useState } from 'react';
import GameIcon from './GameIcon'
import { handleApiData } from '../utils/apicalls';
import { userObject } from '../app/types';

function Home ({profileData} : {profileData: userObject}) {
    const [featuredGames, setFeaturedGames] = useState([])
    useEffect(()=>{
        handleApiData(`/trending`, setFeaturedGames, "get", null)
    },[])

    console.log('homeRender!')
    return (
        <div className="Home content" >
            <img src = "/images/gamecreator.png" className = "homeLogo center"></img>
            <div className = "flexCenter fullWidth mediumHeight homeLogoCaption">MAKE AND SHARE YOUR OWN GAMES!</div>
            <span className = "homeTrendingLabel flexCenter">TRENDING GAMES: </span>
            <div className = "trendingGames">
                <div id = "gameInfo" className = "gameBrowser gameBrowserBig">
                    {typeof featuredGames.map == "function" ? featuredGames?.map((item : {game_name: string})=>{console.log(item);return <GameIcon key={item.game_name} gameData={item} profileData = {profileData}/>}) : ""}
                </div>
            </div>
        </div>
    );
}

export default Home