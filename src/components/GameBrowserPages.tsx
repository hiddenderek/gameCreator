import React, {useEffect, useState} from "react"

function GameBrowserPages ({page, pageList, changePage, gameDisplayLimit, pageDisplayLimit} : {page: number, pageList: object[], changePage: Function, gameDisplayLimit: number, pageDisplayLimit: number}) {
    const [pageOffset, setPageOffset] = useState(0)

    function changePageOffset(direction: number) {
        if ((pageOffset + direction) >= 0) { 
            setPageOffset(prevState=>prevState + direction)
        }
    }
    useEffect(()=>{
        if ((Number(page) + 1) > (pageDisplayLimit + pageOffset)) {
            const newPageOffset = (Number(page) + 1) - Number(pageDisplayLimit)
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
            pageArray.push(<div data-testid = "page_browser_number" className={`pageButton ${page == (pageOffset) ? "pageHighlight" : ""}`} key={"page" + initalPage} onClick={() => { changePage(initalPage - 1) }}>{initalPage}</div>)
            for (let i = 0; i < pageList.length; i++) {
                counter++;
                if ((counter) > (gameDisplayLimit - 1)) {
                    counter = 0;
                    limitPageCounter++
                    pageCounter++
                    if ((limitPageCounter <= pageDisplayLimit) && (i < (pageList.length - ((initalPage - 1) * gameDisplayLimit)))) {
                        //curPage is the page that is currently being created
                        //page is the page that is currently being displayed
                        const curPage = pageCounter
                        pageArray.push(<p data-testid = "page_browser_number" className={`pageButton ${page == (curPage - 1) ? "pageHighlight" : ""}`} key={"page" + curPage} onClick={() => { changePage(curPage - 1) }}>{curPage}</p>)
                    }
                }
            }
        }
        return pageArray
    }

    return(
        <ul className="pageBrowserContainer">
            {(pageList.length / gameDisplayLimit) > pageDisplayLimit ?
            <li data-testid = "page_browser_left_arrow" className = {`fullHeight ${pageOffset === 0 ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(-1)}}>
                <img className = "arrow" src = "/images/arrow.png" />
            </li>
            : ""}
            {getPages()}
            {(pageList.length / gameDisplayLimit) > pageDisplayLimit ?
            <li data-testid = "page_browser_right_arrow" className = {`fullHeight ${pageOffset >= ((pageList.length / gameDisplayLimit) - pageDisplayLimit)  ? "arrowHidden" : ""}`} onClick = {()=>{changePageOffset(1)}}>
                <img className = "arrow flip" src = "/images/arrow.png" />
            </li>
            : ""}
        </ul>
    )
}

export default React.memo(GameBrowserPages)