import React, { MutableRefObject, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import { ProgressPlugin } from 'webpack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { modifyGame } from '../features/gameData/gameData-slice';
function GameElement (props: any, ref: any) {
  const location = useLocation()
  const elementRef = useRef<HTMLDivElement>(null);
  const elementType = useAppSelector((state) => state.gameEditor.currentElement)
  const gameData = useAppSelector((state) => state.gameData.gameData)
  const spikeStatus = useAppSelector((state) => state.gameEvents.spikeStatus)
  const dispatch = useAppDispatch()

  useEffect(() => {
    updateElmProps("gen")
  }, [])

  //this area dispatches actions based on element type. 
  //if the element is of type 'spike' and the spike property has changed, toggle the spike property.
  useEffect(() => {
    if ((gameData[props.index].type == "3")) {
      console.log('isSpike!')
      console.log(gameData[props.index]?.specialProps?.collisionActive)
      console.log(spikeStatus)
      if (gameData[props.index]?.specialProps?.collisionActive !== spikeStatus) {
        dispatch(modifyGame({
          index: props.index, property: "specialProps",
          modifier: {
            collisionActive: spikeStatus
          },
          record: false
        }))
      }
    }
  }, [spikeStatus])

  //changes the element when you click on it and have an element type selected in the game editor.
  function changeElement() {
    if (location.pathname.includes('/gameEditor/')) {
      console.log(elementType)
      dispatch(modifyGame({ index: props.index, property: "type", modifier: elementType, record: true }))
      updateElmProps(elementType)
      console.log(gameData)
    }
  }
  console.log('elementRender')
  // this function initializes the properties of elements, including collision properties. Records location of each element on the page for collision purposes.
  function updateElmProps(mode: string) {
    console.log('updateProps!')
    console.log(gameData[props.index].type)
    console.log(mode)
    if ((mode == "0") && typeof window !== "undefined") {
      dispatch(modifyGame({
        index: props.index, property: "collision", modifier: "delete", record: false
      }))
    } else if (
      ((gameData[props.index].type == "1" || mode == "1") ||
        (gameData[props.index].type == "2" || mode == "2") ||
        (gameData[props.index].type == "3" || mode == "3") ||
        (gameData[props.index].type == "4" || mode == "4")) && typeof window !== "undefined") {
      let initialGameWidth = 1920
      let initialGameHeight = 1080
      let curGameMeasure = ref?.current?.getBoundingClientRect()
      let curGameWidth = curGameMeasure.width
      let curGameHeight = curGameMeasure.height
      let gameWidthAdjust = curGameWidth / initialGameWidth
      let gameHeightAdjust = curGameHeight / initialGameHeight
      dispatch(modifyGame({
        index: props.index, property: "collision",
        modifier: {
          left: elementRef!.current!.offsetLeft / gameWidthAdjust,
          top: elementRef!.current!.offsetTop / gameHeightAdjust,
          bottom: (elementRef!.current!.offsetTop + elementRef!.current!.offsetHeight) / gameHeightAdjust,
          right: (elementRef!.current!.offsetLeft + elementRef!.current!.offsetWidth) / gameWidthAdjust
        },
        record: false
      }))
      console.log('modProps!')
    }

  }

  return (
    <div id={props.id} ref={elementRef} className={`${props.class} ${location.pathname.includes('/gameEditor/') ? 'editorElement' : ""} ${gameData[props.index - 32]?.type == "0" ? 'topElement' : ""}`} onClick={changeElement}>
      {props.text}
    </div>
  );
}

const gameRef = React.forwardRef(GameElement)
export default React.memo(gameRef)