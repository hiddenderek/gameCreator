import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {handleApiData} from '../utils/apicalls';
import { userObject } from '../app/types';
import GameIcon from './GameIcon'
import GameBrowserPages from './GameBrowserPages';
import _ from 'lodash'
import { setSearchTerm } from '../features/userInterface/userInterface-slice';

const gameDisplayLimit = 16
const pageDisplayLimit = 4

type gameObject = {
    game_name: string
}

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

    useEffect(()=>{
        try {
            const { mode, uploaddate, direction, page, search } = JSON.parse('{"' + decodeURI(location.search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            if (mode) {
                setQueryMode(mode)
            }
            if (uploaddate) {
                setUploadDate(uploaddate)
            }
            if (direction) {
                setResultDirection(direction)
            }
            if (page || page === 0) {
                setPage(page)
            }
            if (searchTerm) {
                dispatch(setSearchTerm(search))
            }
            } catch (e) {
                console.error('Invalid URL error: '  + e)
        }
    },[])

    useEffect(() => {
        const oldURL = location.pathname + location.search
        const newURL = `/games?mode=${queryMode}&uploaddate=${uploadDate}&direction=${resultDirection}&page=${page}${(searchTerm || searchTerm == "") ? `&search=${searchTerm}` : ""}`
        if (oldURL !== newURL) {
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

    function changeQueryMode(query: string) {
        setQueryMode(query)

    }
    function changeResultDirection(direction: string) {
        setResultDirection(direction)
    }
    function changeUploadDate(value: string) {
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
                        <div data-testid = "sort_by_time_created" className={`gameBrowserValue ${queryMode === "time_created" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('time_created') }}>Date</div>
                        <div data-testid = "sort_by_game_name" className={`gameBrowserValue ${queryMode === "game_name" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('game_name') }}>Name</div>
                        <div data-testid = "sort_by_likes" className={`gameBrowserValue ${queryMode === "likes" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('likes') }}>Likes</div>
                        <div data-testid = "sort_by_plays" className={`gameBrowserValue ${queryMode === "plays" ? "gameValueSelected" : ""}`} onClick={() => { changeQueryMode('plays') }}>Plays</div>
                    </div>
                    <div className="gameBrowserGroup">
                        <div className="gameBrowserCategory" >Order: </div>
                        <div data-testid = "change_search_result_asc" className={`gameBrowserValue ${resultDirection === "ASC" ? "gameValueSelected" : ""}`} onClick={() => { changeResultDirection('ASC') }}>Ascending</div>
                        <div data-testid = "change_search_result_desc" className={`gameBrowserValue ${resultDirection === "DESC" ? "gameValueSelected" : ""}`} onClick={() => { changeResultDirection('DESC') }}>Descending</div>
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
                        {typeof gameList.map !== "undefined" ? gameList.map((item: gameObject, index) => { return <GameIcon key={item.game_name} index = {index} gameData={item} profileData={profileData} /> }) : ""}
                    </div>
                </div>
                {pageList.length > gameDisplayLimit ? <GameBrowserPages page = {page} pageList = {pageList} changePage = {changePage} gameDisplayLimit = {gameDisplayLimit} pageDisplayLimit = {pageDisplayLimit}/> : ""}
            </div>
        </div>
    );
}

export default GameBrowser