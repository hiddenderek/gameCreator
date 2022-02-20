import { response } from 'express';
import { result } from 'lodash';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { handleApiData } from './Apicalls';
import { userObject } from '../app/types';
import config from '../config'
import GameIcon from './GameIcon'
function GameBrowser ({profileData}:{profileData: userObject}) {
    const [gameList, setGameList] = useState([])
    const [resultDirection, setResultDirection] = useState("DESC")
    const [queryMode, setQueryMode] = useState("time_created")
    const [uploadDate, setUploadDate] = useState("40 YEARS")
    const history = useHistory()
    const location = useLocation()
    const searchTerm = useAppSelector((state) => state.userInterface.searchTerm)
    type gameObject = {
        game_name: string
    }
    useEffect(() => {
        console.log('reload')
        console.log(queryMode)
        const oldURL = location.pathname + location.search
        const newURL = `/games?mode=${queryMode}&uploaddate=${uploadDate}&direction=${resultDirection}${(searchTerm || searchTerm == "") ? `&search=${searchTerm}` : ""}`
        console.log(oldURL)
        console.log(newURL)
        if (oldURL !== newURL) {
            console.log('urlChange')
            history.push(newURL)
        } else {
            handleApiData(location.pathname + location.search, setGameList, "get", null)
        }

    }, [location.search, searchTerm, queryMode, uploadDate, resultDirection])

    function changeQueryMode(query: string) {
        console.log(query)
        setQueryMode(query)

    }
    function changeResultDirection(direction: string) {
        setResultDirection(direction)
    }
    function changeUploadDate(value: string) {
        console.log(value)
        setUploadDate(value)
    }
    return (
        <div className="content sideContent">
            <div className="gameBrowserContainer">
                <div className="gameBrowserBanner">
                    <div className="bannerButton">Sort By: </div>
                    <div className="bannerButton" onClick={() => { changeQueryMode('time_created') }}>Date</div>
                    <div className="bannerButton" onClick={() => { changeQueryMode('game_name') }}>Name</div>
                    <div className="bannerButton" onClick={() => { changeQueryMode('likes') }}>Likes</div>
                    <div className="bannerButton" onClick={() => { changeQueryMode('plays') }}>Plays</div>
                    <div className="bannerButton" >Order: </div>
                    <div className="bannerButton" onClick={() => { changeResultDirection('ASC') }}>Ascending</div>
                    <div className="bannerButton" onClick={() => { changeResultDirection('DESC') }}>Descending</div>
                    <div className="bannerButton" > Limit to: </div>
                    <form className="bannerButton">
                        <select value = {uploadDate} onChange={(e: any) => { changeUploadDate(e.target.value) }}>
                            <option value="1 HOUR">Last Hour</option>
                            <option value="1 DAY">Today</option>
                            <option value="1 WEEK">This Week</option>
                            <option value="1 MONTH">This Month</option>
                            <option value="1 YEAR">This Year</option>
                            <option value="40 YEARS">All Time</option>
                        </select>
                    </form>
                </div>
                <div className = "gameBrowserContentContainer"> 
                <div id="gameBrowser" className="gameBrowser ">
                    {typeof gameList.map !== "undefined" ? gameList.map((item: gameObject) => { return <GameIcon key={item.game_name} gameData={item} profileData = {profileData} /> }) : ""}
                </div>
                </div>
            </div>
        </div>
    );
}

export default GameBrowser