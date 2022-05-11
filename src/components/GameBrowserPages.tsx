import React, {useEffect, useState} from "react"

function GameBrowserPages ({page, pageList, changePage, gameDisplayLimit, pageDisplayLimit} : {page: number, pageList: object[], changePage: Function, gameDisplayLimit: number, pageDisplayLimit: number}) {
    console.log('PAGE RENDER')
    const [pageOffset, setPageOffset] = useState(0)

    function changePageOffset(direction: number) {
        if ((pageOffset + direction) >= 0) { 
            setPageOffset(prevState=>prevState + direction)
        }
    }
    console.log("THE PAGE IS : "+page)
    useEffect(()=>{
        if ((Number(page) + 1) > (pageDisplayLimit + pageOffset)) {
            console.log("NEW PAGE OFFSET DISPLAY LIMIT: " + pageDisplayLimit)
            console.log("NEW PAGE: " + page)
            const newPageOffset = (Number(page) + 1) - Number(pageDisplayLimit)
            console.log("NEW PAGE OFFSET: " + newPageOffset)
            setPageOffset(newPageOffset)
        }
    },[page])
    function getPages() {
        const pageArray = [] as JSX.Element[]
        if (pageList.length > 0) {
            let counter = 0;
            let limitPageCounter = 1;
            let pageCounter = 1 + pageOffset;
            const initalPage = pageCounter
            pageArray.push(<div className={`pageButton ${page == (pageOffset) ? "pageHighlight" : ""}`} key={"page" + initalPage} onClick={() => { changePage(initalPage - 1) }}>{initalPage}</div>)
            for (let i = 0; i < pageList.length; i++) {
                counter++;
                console.log(counter)
                if ((counter) > (gameDisplayLimit - 1)) {
                    counter = 0;
                    console.log(pageCounter)
                    limitPageCounter++
                    pageCounter++
                    console.log('pageCounter i is: ' + pageCounter)
                    console.log("i is: " + i)
                    console.log("i is limit: " + (pageList.length - 16))
                    if ((limitPageCounter <= pageDisplayLimit) && (i < (pageList.length - ((initalPage - 1) * gameDisplayLimit)))) {
                        const curPage = pageCounter
                        console.log('is highlight page: ' + page)
                        console.log('is highlight curPage: ' + curPage)
                        console.log('is highlight: ' + (page == (curPage - 1)))
                        pageArray.push(<p className={`pageButton ${page == (curPage - 1) ? "pageHighlight" : ""}`} key={"page" + curPage} onClick={() => { changePage(curPage - 1) }}>{curPage}</p>)
                    }
                }
            }
            console.log(pageArray)
        }
        return pageArray
    }

    return(
        <ul className="pageBrowserContainer">
            {(pageList.length / gameDisplayLimit) > pageDisplayLimit ?
            <li className = {`fullHeight ${pageOffset === 0 ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(-1)}}>
                <img  className = "arrow" src = "/images/arrow.png" />
            </li>
            : ""}
            {getPages()}
            {(pageList.length / gameDisplayLimit) > pageDisplayLimit ?
            <li className = {`fullHeight ${pageOffset >= ((pageList.length / gameDisplayLimit) - pageDisplayLimit)  ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(1)}}>
                <img  className = "arrow flip" src = "/images/arrow.png" />
            </li>
            : ""}
        </ul>
    )
}

export default React.memo(GameBrowserPages)