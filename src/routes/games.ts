import express from 'express'
import jwt from 'jsonwebtoken'
import PoolGet from 'pg'
const Pool = PoolGet.Pool
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "postgres",
    port: 5432,
    database: "gamecreator"
})
const fs = require("fs")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

function authenticateToken(req: any, res: any, next: any) {
    console.log('AUTHENTICATE')
    console.log(req.cookies)
    const token = JSON.parse(req.cookies.secureCookie)
    if (token == null) {
        console.log('NULL AUTHENTICATE')
        return res.sendStatus(401)
    }
    jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log('ERROR AUTHENTICATE')
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

router.get('/api/games', async (req: any, res: any) => {
    console.log('getGames')
    try {
        let parameters = []
        if (req?.query?.search) { 
            parameters.push(`%${req.query.search}%`) 
        }
        if (req?.query?.page && !req?.query?.countgames) {
            parameters.push(Number(req.query.page) * 16)
        }

        let orderByFormat = "ORDER BY game_name"
        switch (req?.query?.mode) {
            case "game_name":
                orderByFormat = "ORDER BY game_name"
                break
            case "time_created":
                orderByFormat = "ORDER BY time_created"
                break
            case "likes":
                orderByFormat = "ORDER BY likes"
                break
            case "plays":
                orderByFormat = "ORDER BY plays"
                break
        }

        let uploadDateFormat = "INTERVAL '40 YEARS'"
        switch (req?.query?.uploaddate) {
            case "40 YEARS": 
                uploadDateFormat = "INTERVAL '40 YEARS'"
                break
            case "1 YEAR": 
                uploadDateFormat = "INTERVAL '1 YEAR'"
                break
            case "1 MONTH": 
                uploadDateFormat = "INTERVAL '1 MONTH'"
                break
            case "1 WEEK": 
                uploadDateFormat = "INTERVAL '1 WEEK'"
                break
            case "1 DAY": 
                uploadDateFormat = "INTERVAL '1 DAY'"
                break
            case "1 HOUR": 
                uploadDateFormat = "INTERVAL '1 HOUR'"
                break
        }
        console.log(parameters)
        console.log("COUNT GAMES: " + req?.query?.countgames)
        const actionCheck = await pool.query(`SELECT * FROM gameactions`)
        console.log(`
        SELECT game_name, ${req?.query?.countgames ? "" : "game_data, user_id, grid_image, "} id, plays, time_created${actionCheck?.rows?.length > 0 ? ", (like_count - dislike_count) AS likes" : "" } FROM (
            SELECT DISTINCT d.game_name, ${req?.query?.countgames ? "" : "d.game_data, d.user_id, d.grid_image,"} d.id, d.plays, d.time_created
            ${actionCheck?.rows?.length > 0 ? ", COUNT(CASE WHEN a.game_id = d.id AND a.action = 'like' THEN a.game_id ELSE NULL END)::int AS like_count" : "" } 
            ${actionCheck?.rows?.length > 0 ? ", COUNT(CASE WHEN a.game_id = d.id AND a.action = 'dislike' THEN a.game_id ELSE NULL END)::int AS dislike_count"  : "" }
            FROM gamedata d${actionCheck?.rows?.length > 0 ? ", gameactions a" : ""} GROUP BY d.id
            ) AS q1 
            ${req?.query?.search || req?.query?.uploaddate ?
                'WHERE' : ""} 
            ${req?.query?.search ?
                `game_name ILIKE $1` : ""} 
            ${req?.query?.uploaddate && req?.query?.search ? 
                "AND" : ""} 
            ${req?.query?.uploaddate ? 
                `time_created > NOW() - ${uploadDateFormat}` : ""} 
            ${orderByFormat} 
            ${req?.query?.direction === "ASC" ? 
                "ASC" : req?.query.direction === "DESC" ? "DESC" : ""} 
            ${req?.query?.countgames ?
                "" : "LIMIT 16"} 
            ${req?.query?.page && !req?.query?.countgames ?
                `OFFSET ${req?.query?.search ? "$2" : "$1"}` : ""}
        `)
        const selectGames = await pool.query(`
        SELECT game_name, ${req?.query?.countgames ? "" : "game_data, user_id, grid_image, "} id, plays, time_created${actionCheck?.rows?.length > 0 ? ", (like_count - dislike_count) AS likes" : "" } FROM (
            SELECT DISTINCT d.game_name, ${req?.query?.countgames ? "" : "d.game_data, d.user_id, d.grid_image,"} d.id, d.plays, d.time_created
            ${actionCheck?.rows?.length > 0 ? ", COUNT(CASE WHEN a.game_id = d.id AND a.action = 'like' THEN a.game_id ELSE NULL END)::int AS like_count" : "" } 
            ${actionCheck?.rows?.length > 0 ? ", COUNT(CASE WHEN a.game_id = d.id AND a.action = 'dislike' THEN a.game_id ELSE NULL END)::int AS dislike_count"  : "" }
            FROM gamedata d${actionCheck?.rows?.length > 0 ? ", gameactions a" : ""} GROUP BY d.id
            ) AS q1 
            ${req?.query?.search || req?.query?.uploaddate ?
                'WHERE' : ""} 
            ${req?.query?.search ?
                `game_name ILIKE $1` : ""} 
            ${req?.query?.uploaddate && req?.query?.search ? 
                "AND" : ""} 
            ${req?.query?.uploaddate ? 
                `time_created > NOW() - ${uploadDateFormat}` : ""} 
            ${orderByFormat} 
            ${req?.query?.direction === "ASC" ? 
                "ASC" : req?.query.direction === "DESC" ? "DESC" : ""} 
            ${req?.query?.countgames ?
                "" : "LIMIT 16"} 
            ${req?.query?.page && !req?.query?.countgames ?
                `OFFSET ${req?.query?.search ? "$2" : "$1"}` : ""}
        `, parameters)
        if (selectGames.rows) {
            res.status(200)
            res.json(selectGames.rows)
            console.log('got games')
        } else {
            res.status(404)
            res.json('Failed getting games.')
            console.log('could not get any games')
        }
    } catch (e : any) {
        console.log('SEARCH ERROR: ' + e)
        res.status(400)
        res.json('Failed getting games.'+ e.message)
    }
})
router.get('/api/games/:userName', async (req: any, res: any) => {
    console.log('getGamesUser')
    try {
        const { userName } = req.params
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        const parameters = req?.query?.search ? [id, `%${req.query.search}%`] : [id]
        const readGameData = await pool.query(`
        SELECT * FROM gamedata WHERE user_id = $1 ${req?.query?.search ? `AND game_name ILIKE $2` : ""}
        `, parameters)
        if (readGameData.rows) {
            res.status(200)
            res.json(readGameData.rows)
        } else {
            res.status(404)
            res.json('Failed getting games from user.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('Failed getting games from user.')
    }
})
router.get('/api/games/:userName/:gameName', async (req: any, res: any) => {
    console.log('getGame')
    try {
        console.log('requesting game')
        const { userName, gameName } = req.params
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = $1
        `, [userName])
        const { id } = getUser.rows[0]
        const readGameData = await pool.query(`
        SELECT * FROM gamedata WHERE user_id = $1 AND game_name = $2
        `, [id, gameName])
        if (readGameData.rows[0]) {
            res.status(200)
            res.json(readGameData.rows[0])
        } else {
            res.status(404)
            res.json('Failed getting game data.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed reading game')
    }
})
router.post('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('postGame')
    try {
        const { userName } = req.params
        const { newGameName, screen, gridImage } = req.body
        const gameData = JSON.stringify(req.body.gameData)
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = $1
        `, [userName])
        const { id } = getUser.rows[0]
        let addGame
        //user_id is a foreign key
        if (id && req.user.name == userName && newGameName) {
            addGame = await pool.query(`
            INSERT INTO gamedata (id, game_name, game_data, user_id, time_created, grid_image) VALUES (uuid_generate_v4(), $1, '{}', $2, CURRENT_TIMESTAMP, $3) RETURNING *
            `, [newGameName, id, gridImage])
        } else if (!newGameName){
            res.status(404)
            res.json('Game name must exist.')
        } else {
            res.status(404)
            res.json('Failed adding game.')      
        }
        const gameId = addGame?.rows[0].id
        if (screen && gameData && gameId && req.user.name == userName) {
            const addGameData = await pool.query(`
            UPDATE gamedata SET game_data = jsonb_set(game_data, $1, $2, true) WHERE id = $3 RETURNING jsonb_pretty(game_data)
            `, [`{${screen}}`, `{"gameData":${gameData}}`, gameId])
            if (addGameData) {
                res.status(200)
                res.json(addGameData)
            } else {
                res.status(404)
                res.json('Failed adding game.')
            }
           
            console.log('gamedata:')
        }


    } catch (e: any) {
        console.log(e)
        res.status(400)
        if (e.message.includes('violates unique constraint') && e.message.includes('game_name')) {
            res.json('Game name is already used.')
        }
        if (e.message.includes('nameminiumlength')) {
            res.json('Game name character length must be greater than 1')
        }
        if (e.message.includes('namecharviolation')){
            res.json('Game name must not include special characters "/ \\ & ? . = { }"')
        }
        if (e.message.includes('nameviolation')){
            res.json('Game name must not be equal to new or blank.')
        }
       
    }
})

router.patch('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('patchGame')
    try {
        const { userName, gameName } = req.params
        const { newGameName, gameData, screen, gridImage, plays } = req.body
        const columnType = Object.keys(req.body)[0]
        const gameDataString = JSON.stringify(gameData)
        console.log(userName)
        console.log(gameName)
        console.log(newGameName)
        console.log(screen)
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        if (screen && gameData && id && req.user.name == userName) {
            const saveGame = await pool.query(`  
            UPDATE gamedata SET game_data = jsonb_set(game_data, $1, $2), grid_image = $3, game_name = $4 WHERE user_id = $5 AND  game_name = $6 RETURNING game_data
            `, [`{${screen}}`, `{"gameData" : ${gameDataString}}`, gridImage, newGameName, id, gameName])
            if (saveGame.rows[0]) {
                res.status(200)
                res.json(saveGame.rows[0])
            } else {
                res.status(404)
                res.json('Failed updating game screen.')
            }
        } else if (id && (req.user.name == userName || plays)) {
            console.log('UPDATE')
            const updateGame = await pool.query(`
            UPDATE gamedata SET ${columnType} = $1 WHERE user_id = $2 AND  game_name = $3 RETURNING $4
            `, [req.body[columnType], id, gameName, columnType])
            if (updateGame.rows[0]) {
                res.status(200)
                res.json(updateGame.rows[0])
            } else {
                res.status(404)
                res.json('Failed updating game.')
            }
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed modifying game')
    }
})

router.delete('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('deleteGame')
    try {
        const { userName, gameName} = req.params
        const { screen, mode } = req.body
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = $1
        `, [userName])
        const { id } = getUser.rows[0]
        console.log(id, mode, req.user.name, userName)
        if (id && mode == "game" && req.user.name == userName) {
            const getGameId = await pool.query(`
            SELECT * FROM gamedata WHERE user_id = $1 AND  game_name = $2
            `, [id, gameName])
            const gameId = getGameId.rows[0].id
            const deleteGameLikes = await pool.query(`
            DELETE FROM gameactions WHERE game_id =  $1
            `, [gameId])
            const deleteGame = await pool.query(`  
            DELETE FROM gamedata WHERE user_id = $1 AND  game_name = $2
            `, [id, gameName])
            if (deleteGame) {
                console.log(deleteGame)
                console.log('deleted')
                res.status(200)
                res.json(deleteGame)
            } else {
                res.status(404)
                console.log('not deleted')
                res.json('Could not delete game')
            }
        } else if (screen && id && mode == "screen" && req.user.name == userName) {
            const deleteGameScreen = await pool.query(`  
            UPDATE gamedata SET game_data = game_data - $1 WHERE user_id = $2 AND  game_name = $3 RETURNING game_data
            `, [screen, id, gameName])
            if (deleteGameScreen) {
                console.log('delete game screen')
                res.status(200)
                res.json(deleteGameScreen)
            } else {
                res.status(404)
                console.log('could not do that.')
                res.json('Could not delete game screen.')
            }
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed deleting game')
    }
})

router.get('/api/gameEditor/:userName/:gameName', async (req: any, res: any) => {
    console.log('getGameEditorGame')
    try {
        const { userName, gameName } = req.params
        console.log('GET EDITOR')
        console.log(userName)
        if (gameName == "new") {
            console.log('readin')
            try {
                const data = fs.readFileSync("./src/data/gameData.txt", 'utf8', (err: any, dataRead: any) => {
                    return dataRead
                })
                if (data) {
                    res.status(200)
                    res.json(data)
                } else {
                    res.status(404)
                    res.json('Failed getting default data.')
                }
            } catch (e) {
                console.log('error')
                console.log(e)
                res.status(400)
                res.json('Failed getting default data.')
            }
        } else {
            console.log('gettinGAME!')
            try {
                const getUser = await pool.query(`
                SELECT id FROM users WHERE username = $1
                `, [userName])
                const { id } = getUser.rows[0]
                const readGameData = await pool.query(`
                SELECT * FROM gamedata WHERE user_id = $1 AND game_name = $2
                `, [id, gameName])
                if (readGameData) {
                    res.status(200)
                    res.json(readGameData.rows[0])
                } else {
                    res.status(404)
                    res.json('Failed reading game.')
                }
            } catch (e) {
                console.log(e)
                res.status(400)
                res.json('failed reading game')
            }
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed loading gameData')
    }

})

export default router