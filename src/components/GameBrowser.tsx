import { response } from 'express';
import { result } from 'lodash';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { handleApiData } from './Apicalls';
import { userObject } from '../app/types';
import config from '../config'
import GameIcon from './GameIcon'
import GameBrowserPages from './GameBrowserPages';
import _ from 'lodash'
import { setSearchTerm } from '../features/userInterface/userInterface-slice';

const gameDisplayLimit = 16
const pageDisplayLimit = 4

function GameBrowser({ profileData }: { profileData: userObject }) {
    const [gameList, setGameList] = useState([])
    const [pageList, setPageList] = useState([] as object[])
    const [resultDirection, setResultDirection] = useState("DESC")
    const [queryMode, setQueryMode] = useState("time_created")
    const [uploadDate, setUploadDate] = useState("40 YEARS")
    const [page, setPage] = useState(0)
    const history = useHistory()
    const location = useLocation()
    const searchTerm = useAppSelector((state) => state.userInterface.searchTerm)
    const dispatch = useAppDispatch()
    type gameObject = {
        game_name: string
    }

    useEffect(()=>{
        try {
            const {mode, uploaddate, direction, page, search} = JSON.parse('{"' + decodeURI(location.search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
            setQueryMode(mode)
            setUploadDate(uploaddate)
            setResultDirection(direction)
            setPage(page)
            dispatch(setSearchTerm(search))
            } catch (e) {
                console.log('Invalid URL error: '  + e)
        }
    },[])
    useEffect(() => {
        console.log('reload')
        console.log(queryMode)
        const oldURL = location.pathname + location.search
        const newURL = `/games?mode=${queryMode}&uploaddate=${uploadDate}&direction=${resultDirection}&page=${page}${(searchTerm || searchTerm == "") ? `&search=${searchTerm}` : ""}`
        console.log(oldURL)
        console.log(newURL)
        if (oldURL !== newURL) {
            console.log('urlChange')
            history.push(newURL)
        } else {
            handleApiData(location.pathname + location.search, setGameList, "get", null)
            handleApiData(location.pathname + location.search + '&countgames=true', setPageList, "get", null)
        }

    }, [location.search, searchTerm, queryMode, uploadDate, page, resultDirection])

    //resets the page to zero when you filter by something that changes the amount of results.
    //This is to prevent you from being on a page that shouldnt exist. 
    useEffect(()=>{
        if (page !== 0) {
            changePage(0)
        }
    },[searchTerm, uploadDate])

    console.log(pageList)
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
    function changePage(page: number) {
        setPage(page)
    }

    return (
        <div className="content sideContent">
            <div className="gameBrowserContainer">
                <div className="gameBrowserBanner">
                    <div className="gameBrowserGroup">
                        <div className="gameBrowserCategory">Sort By: </div>
                        <div className={`gameBrowserValue ${queryMode === "time_created" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('time_created') }}>Date</div>
                        <div className={`gameBrowserValue ${queryMode === "game_name" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('game_name') }}>Name</div>
                        <div className={`gameBrowserValue ${queryMode === "likes" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('likes') }}>Likes</div>
                        <div className={`gameBrowserValue ${queryMode === "plays" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('plays') }}>Plays</div>
                    </div>
                    <div className="gameBrowserGroup">
                        <div className="gameBrowserCategory" >Order: </div>
                        <div className={`gameBrowserValue ${resultDirection === "ASC" ? "gameValueSelected" : ""}`} onClick={() => { changeResultDirection('ASC') }}>Ascending</div>
                        <div className={`gameBrowserValue ${resultDirection === "DESC" ? "gameValueSelected" : ""}`} onClick={() => { changeResultDirection('DESC') }}>Descending</div>
                        <div className="gameBrowserCategory" > Limit to: </div>
                        <form className="gameBrowserValue">
                            <select value={uploadDate} onChange={(e: any) => { changeUploadDate(e.target.value) }}>
                                <option value="1 HOUR">Last Hour</option>
                                <option value="1 DAY">Today</option>
                                <option value="1 WEEK">This Week</option>
                                <option value="1 MONTH">This Month</option>
                                <option value="1 YEAR">This Year</option>
                                <option value="40 YEARS">All Time</option>
                            </select>
                        </form>
                    </div>
                </div>
                <div className="gameBrowserContentContainer">
                    <div id="gameBrowser" className="gameBrowser ">
                        {typeof gameList.map !== "undefined" ? gameList.map((item: gameObject) => { return <GameIcon key={item.game_name} gameData={item} profileData={profileData} /> }) : ""}
                    </div>
                </div>
                {pageList.length > gameDisplayLimit ? <GameBrowserPages page = {page} pageList = {pageList} changePage = {changePage} gameDisplayLimit = {gameDisplayLimit} pageDisplayLimit = {pageDisplayLimit}/> : ""}
            </div>
        </div>
    );
}

export default GameBrowser