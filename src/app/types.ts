export interface event {
    key: string,
    ctrlKey: boolean,
    target: {
        tagName: string
    }
}

export interface userObject {
    username: string
}

export type userData = {
    username: string,
    total_score: number,
    score_count: number
    play_count: number
}

export type rankItem = {
    score: number,
    username: string
}