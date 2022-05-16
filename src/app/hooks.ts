import {useReducer} from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {RootState, AppDispatch} from './store'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useToggle = (initialVal: boolean) => {
    return useReducer((state) => {
        return !state
    }, initialVal)
}

export const useCount = (initialVal: number) => {
    return useReducer((state) => {
        return state += 1
    }, initialVal)
}