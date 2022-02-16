import express from 'express'
import serverRenderer from './renderers/serverRender';
import jwt from 'jsonwebtoken'
import config from './config'
import processEnv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
processEnv.config()
import PoolGet from 'pg'
const Pool = PoolGet.Pool
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "localhost",
    port: 5432,
    database: "gamecreator"
})
const fs = require("fs")

const app = express()
app.use(express.json({ limit: "2mb" }))
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(cors({
    origin: `http://localhost:${config.authPort}`
}));
function authenticateToken(req: any, res: any, next: any) {
    console.log('AUTHENTICATE')
    const token = JSON.parse(req.cookies.secureCookie)
    if (token == null) return res.sendStatus(401)
    jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
app.get('/api/currentUser', authenticateToken, async (req: any, res: any) => {
    console.log('getCurrentUser')
    try {
        console.log(req.user)
        if (req.user.name) res.status(200)
        res.json(req.user.name)
    } catch (e) {
        res.status(404)
        res.json('')
    }
})

app.get('/api/users', authenticateToken, async (req: any, res: any) => {
    console.log('getUsers')
    try {
        const showUsers = await pool.query(`
        SELECT * FROM users
        `)
        if (showUsers) res.status(200)
        res.json(showUsers.rows)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed selecting users')
    }
})

app.get('/api/users/:userName', async (req: any, res: any) => {
    console.log('getUser')
    try {
        const { userName } = req.params
        console.log(userName)
        let showUser
        if (userName.length <= 30) {
            showUser = await pool.query(`
            SELECT username, time_of_signup, date_of_birth FROM users WHERE username = '${userName}'
            `)
        } else if (userName.length > 30) {
            showUser = await pool.query(`
            SELECT username, time_of_signup, date_of_birth FROM users WHERE id = '${userName}'
            `)
        }
        console.log(showUser?.rows[0])
        if (showUser) res.status(200)
        res.json(showUser?.rows[0])
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed selecting users')
    }
})

app.post('/api/users/:userName', async (req: any, res: any) => {
    console.log('postUser')
    try {
        const { userName } = req.params
        const { password } = req.body
        const { dateOfBirth } = req.body
        console.log(userName)
        console.log(password)
        console.log(dateOfBirth)
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const addUser = await pool.query(`
        INSERT INTO users (id, username, password, date_of_birth, time_of_signup) VALUES (uuid_generate_v4(), '${userName}', '${hashedPassword}', DATE '${dateOfBirth}', CURRENT_DATE) RETURNING *
        `)
        console.log('savin')
        if (addUser) res.status(200)
        res.json("Successful! User has been added")
    } catch (e: any) {
        console.log(e.message)
        res.status(404)
        if (e.message.match('violates unique constraint') && e.message.match('password')) {
            res.json('Failed. Password must be unique.')
        }
        if (e.message.match('violates unique constraint') && e.message.match('username')) {
            res.json('Failed. Username must be unique.')
        }
    }
})

app.patch('/api/users/:userName', authenticateToken, async (req: any, res: any) => {
    console.log('patchUser')
    try {
        const { userName } = req.params
        const userChange = req.body
        const columnType = Object.keys(userChange)[0]
        const updateUser = await pool.query(`
        UPDATE users SET ${columnType} = '${userChange[columnType]}' WHERE username = '${userName}' RETURNING *
        `)
        console.log('savin')
        if (updateUser) res.status(200)
        res.json(updateUser.rows[0])
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed modifying users')
    }

})

app.delete('/api/users/:userName', authenticateToken, async (req: any, res: any) => {
    console.log('deleteUser')
    try {
        const { userName } = req.params
        const updateUser = await pool.query(`
        DELETE FROM users WHERE username = '${userName}' RETURNING *
        `)
        if (updateUser) res.status(200)
        res.json(updateUser.rows[0])
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed deleting users')
    }

})

app.get('/api/trending', async (req: any, res: any) => {
    console.log('getTrending')
    try {
        console.log('getting FEATURE LENGTH')
        const trendingGames = await pool.query(`
        SELECT * FROM (
            SELECT DISTINCT d.game_name, d.game_data, d.id, d.user_id, d.plays, d.grid_image, 
            PERCENT_RANK() OVER (ORDER BY d.plays ASC) AS play_rank, d.time_created, 
            PERCENT_RANK() OVER (ORDER BY d.time_created ASC) AS time_rank, 
            COUNT(CASE WHEN a.game_id = d.id AND a.action = 'like' THEN a.game_id ELSE NULL END)::int AS like_count, 
            COUNT(CASE WHEN a.game_id = d.id AND a.action = 'dislike' THEN a.game_id ELSE NULL END)::int AS dislike_count 
            FROM gamedata d, gameactions a GROUP BY d.id
            ) AS q1 
        ORDER BY ((like_count - dislike_count) * time_rank * time_rank * play_rank) DESC Limit 32 
        `)
        if (trendingGames) res.status(200)
        res.json(trendingGames.rows)
    } catch (e) {
        res.status(404)
        console.log(e)
    }
})

app.get('/api/ranks/scores', async (req: any, res: any) =>{
    try {
        console.log('getScores!')
        const getScores = await pool.query(`
        SELECT * FROM (
            SELECT DISTINCT u.username,
            COUNT(CASE WHEN u.id = s.user_id THEN s.id ELSE NULL END) AS score_count
            FROM users u, gamescores s GROUP BY u.id
        ) AS Q1 WHERE score_count IS NOT NULL ORDER BY score_count DESC LIMIT 25 
        `)
        console.log(getScores.rows)
        if (getScores.rows[0]) {
            res.status(200)
            res.json(getScores.rows)
        } else {
            res.status(400) 
            res.json('No scores available.')
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed getting ranks')
    }
})
app.get('/api/ranks/plays', async (req: any, res: any) => {
    try {
        const getRanks = await pool.query(`
            SELECT * FROM (
                SELECT DISTINCT u.username, 
                SUM(CASE WHEN u.id = d.user_id THEN d.plays ELSE NULL END)::int AS play_count
                FROM users u, gamedata d GROUP BY u.id
            ) AS q1 WHERE play_count IS NOT NULL LIMIT 25
        `)
        if (getRanks.rows) {
            res.status(200)
            res.json(getRanks.rows)
        }
    } catch (e) {
        res.status(404)
        res.json('failed getting ranks: ' + e)
    }
})

app.get('/api/ranks/likes', async (req: any, res: any) => {
    try {
        const getRanks = await pool.query(`
        SELECT (total_likes - total_dislikes) AS total_score, username FROM (
            SELECT SUM(like_count) AS total_likes, SUM(dislike_count) AS total_dislikes, username FROM (
                SELECT d.user_id AS gameUserId, u.id AS userId, d.game_name, u.username AS username,   
                COUNT(CASE WHEN a.game_id = d.id AND a.action = 'like' THEN a.game_id ELSE NULL END)::int AS like_count, 
                COUNT(CASE WHEN a.game_id = d.id AND a.action = 'dislike' THEN a.game_id ELSE NULL END)::int AS dislike_count 
                FROM gamedata d, gameactions a, users u GROUP BY d.id, u.id
                ) AS q1 WHERE gameUserId = userId GROUP BY username
            ) AS q2 ORDER BY total_score DESC LIMIT 50
        `)
        if (getRanks.rows) {
            res.status(200)
            res.json(getRanks.rows)
        }
    } catch (e) {
        res.status(404)
        res.json('failed getting ranks: ' + e)
    }
})



app.get('/api/games', async (req: any, res: any) => {
    console.log('getGames')
    try {
        const selectGames = await pool.query(`
        SELECT * FROM gamedata ${req?.query?.search || req?.query?.uploaddate ? 'WHERE' : ""} ${req?.query?.search ? `game_name ILIKE '%${req.query.search}%'` : ""} ${req?.query?.uploaddate && req?.query?.search ? "AND" : ""} ${req?.query?.uploaddate ? `time_created > NOW() - INTERVAL '${req?.query?.uploaddate}'` : ""} ORDER BY ${req?.query?.mode ? req.query.mode : "time_created"} ${req?.query?.direction ? req.query.direction : "ASC"}
        `)
        if (selectGames) res.status(200)
        res.json(selectGames.rows)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed selecting games')
    }
})
app.get('/api/games/:userName', async (req: any, res: any) => {
    console.log('getGamesUser')
    try {
        const { userName } = req.params
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        const readGameData = await pool.query(`
        SELECT * FROM gamedata WHERE user_id = '${id}' ${req?.query?.search ? `AND game_name ILIKE '%${req.query.search}%'` : ""}
        `)
        if (readGameData) res.status(200)
        res.json(readGameData.rows)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed reading game')
    }
})
app.get('/api/games/:userName/:gameName', async (req: any, res: any) => {
    console.log('getGame')
    try {
        console.log('requesting game')
        const { userName } = req.params
        const { gameName } = req.params
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        const readGameData = await pool.query(`
        SELECT * FROM gamedata WHERE user_id = '${id}' AND game_name = '${gameName}'
        `)
        if (readGameData) res.status(200)
        res.json(readGameData.rows[0])
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed reading game')
    }
})
app.post('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('postGame')
    try {
        const { userName } = req.params
        const { gameName } = req.params
        const { screen, gridImage } = req.body
        const gameData = JSON.stringify(req.body.gameData)
        console.log(userName)
        console.log(gameName)
        console.log(screen)
        console.log(req.body)
        console.log(`SELECT * FROM users WHERE username = '${userName}'`)
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        let addGame
        //user_id is a foreign key
        if (id && req.user.name == userName) {
            addGame = await pool.query(`
            INSERT INTO gamedata (id, game_name, game_data, user_id, time_created, grid_image) VALUES (uuid_generate_v4(), '${gameName}', '{}', '${id}', CURRENT_TIMESTAMP, '${gridImage}') RETURNING *
            `)
        }
        console.log('ROWINFO: ')
        console.log(`UPDATE gamedata SET game_data = jsonb_set(game_data, '{${screen}}', '{"gameData":${gameData}}', true) WHERE id = '' RETURNING game_data`)
        const gameId = addGame?.rows[0].id
        if (screen && gameData && gameId && req.user.name == userName) {
            const addGameData = await pool.query(`
            UPDATE gamedata SET game_data = jsonb_set(game_data, '{${screen}}', '{"gameData":${gameData}}', true) WHERE id = '${gameId}' RETURNING jsonb_pretty(game_data)
            `)
            if (addGameData) (res.status(200))
            res.json(addGameData)
            console.log('gamedata:')
        }


    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed adding game')
    }
})

app.patch('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('patchGame')
    try {
        const { userName } = req.params
        const { gameName } = req.params
        const { gameData, screen, gridImage } = req.body
        const columnType = Object.keys(req.body)[0]
        const gameDataString = JSON.stringify(gameData)
        console.log(userName)
        console.log(gameName)
        console.log(screen)
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        if (screen && gameData && id && req.user.name == userName) {
            const saveGame = await pool.query(`  
            UPDATE gamedata SET game_data = jsonb_set(game_data, '{${screen}}', '{"gameData" : ${gameDataString}}'), grid_image = '${gridImage}' WHERE user_id = '${id}' AND  game_name = '${gameName}' RETURNING game_data
            `)
            if (saveGame) res.status(200)
            res.json(saveGame.rows[0])
        } else if (id && req.user.name == userName) {
            console.log('UPDATE')
            const updateGame = await pool.query(`
            UPDATE gamedata SET ${columnType} = '${req.body[columnType]}'  WHERE user_id = '${id}' AND  game_name = '${gameName}' RETURNING ${columnType}
            `)
            if (updateGame) res.status(200)
            res.json(updateGame.rows[0])
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed modifying game')
    }
})

app.delete('/api/games/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('deleteGame')
    try {
        const { userName } = req.params
        const { gameName } = req.params
        const { screen } = req.body
        const { mode } = req.body
        console.log(userName)
        console.log(gameName)
        console.log(screen)
        console.log(mode)
        const getUser = await pool.query(`
        SELECT id FROM users WHERE username = '${userName}'
        `)
        const { id } = getUser.rows[0]
        if (id && mode == "game" && req.user.name == userName) {
            const getGameId = await pool.query(`
            SELECT * FROM gamedata WHERE user_id = '${id}' AND  game_name = '${gameName}'
            `)
            const gameId = getGameId.rows[0].id
            const deleteGameLikes = await pool.query(`
            DELETE FROM gameactions WHERE game_id = '${gameId}'
            `)
            const deleteGame = await pool.query(`  
            DELETE FROM gamedata WHERE user_id = '${id}' AND  game_name = '${gameName}'
            `)
            if (deleteGame) res.status(200)
            res.json(deleteGame)
        } else if (screen && id && mode == "screen" && req.user.name == userName) {
            const deleteGameScreen = await pool.query(`  
            UPDATE gamedata SET game_data = game_data - '${screen}' WHERE user_id = '${id}' AND  game_name = '${gameName}' RETURNING game_data
            `)
            if (deleteGameScreen) res.status(200)
            res.json(deleteGameScreen)
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed deleting game')
    }
})

app.get('/api/games/:userName/:gameName/scores', async (req: any, res: any) => {
    try {
        const {userName, gameName} = req.params
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = '${gameName}'
        `)

        const gameId = getGameId?.rows[0]?.id 

        const getGameScores = await pool.query(`
            SELECT g.score, u.username FROM gamescores g LEFT JOIN users u ON g.user_id = u.id WHERE g.game_id = '${gameId}' ORDER BY g.score DESC LIMIT 25
        `)
        if (getGameScores.rows[0]) {
            res.status(200)
            res.json(getGameScores.rows)
        }
        console.log(getGameScores)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed getting scores')
    }
})

app.post('/api/games/:userName/:gameName/scores/:curUser', authenticateToken, async (req: any, res: any) => {
    try {
        const { userName, gameName, curUser } = req.params
        const { score } = req.body
        console.log(userName, gameName, curUser, score)
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = '${gameName}'
        `)

        const gameId = getGameId?.rows[0]?.id

        const getUserId = await pool.query(`
        SELECT id FROM users WHERE username = '${curUser}'
        `)

        const userId = getUserId?.rows[0]?.id
        console.log(userId, gameId)
        if (gameId && userId && req.user.name == curUser) {
            let oldScore = 1000000
            const getOldScore = await pool.query(`
            SELECT score FROM gamescores WHERE game_id = '${gameId}' AND user_id = '${userId}'
            `)
            if (getOldScore.rows[0]) {
                oldScore = getOldScore.rows[0].score
            }
            const postNewScore = await pool.query(`
            INSERT INTO gamescores (id, score, game_id, user_id) VALUES (uuid_generate_v4(), ${score}, '${gameId}', '${userId}') ON CONFLICT (game_id, user_id) ${score < oldScore ? `DO UPDATE SET score = ${score}` : 'DO NOTHING'}
            `)
            if (postNewScore.rows[0]) {
                console.log(postNewScore.rows[0])
                res.status(200)
                res.json(postNewScore.rows[0])
            }
        } else {
            res.status(400)
            res.json('failed setting high score')
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed setting high score')
    }
})

app.get('/api/games/:userName/:gameName/actions/:action', async (req: any, res: any) => {
    console.log('getLikes')
    try {
        const { userName } = req.params
        const { gameName } = req.params
        const { action } = req.params
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = '${gameName}' 
        `)
        const gameId = getGameId.rows[0]?.id
        const addAction = await pool.query(`
        SELECT * FROM gameactions WHERE game_id = '${gameId}' AND action = '${action}'
        `)
        if (addAction) res.status(200)
        res.json(addAction?.rows?.length)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed getting likes')
    }
})
app.post('/api/games/:userName/:gameName/actions/:action', authenticateToken, async (req: any, res: any) => {
    console.log('addLikes')
    try {
        console.log('gameAction!')
        const { userName } = req.params
        const { gameName } = req.params
        const { action } = req.params
        const { name } = req.user
        console.log(gameName)
        console.log(name)
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = '${gameName}' 
        `)
        const gameId = getGameId.rows[0]?.id
        const getUserId = await pool.query(`
        SELECT id FROM users WHERE username = '${name}'
        `)
        const userId = getUserId.rows[0]?.id
        console.log(`INSERT INTO gameactions (id, action, game_id, user_id) VALUES ('${gameId}${userId}', '${action}', '${gameId}', '${userId}')`)
        const addAction = await pool.query(`
        INSERT INTO gameactions (id, action, game_id, user_id) VALUES ('${gameId}${userId}', '${action}', '${gameId}', '${userId}') ON CONFLICT (id) DO UPDATE SET action = '${action}'
        `)
        if (addAction) res.status(200)
        res.json(addAction.rows[0])
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed liking game')
    }
})

app.get('/api/gameEditor/:userName/:gameName', authenticateToken, async (req: any, res: any) => {
    console.log('getGameEditorGame')
    try {
        const { userName } = req.params
        const { gameName } = req.params
        console.log('GET EDITOR')
        console.log(userName)
        console.log(req.user.name)
        let data: any
        if (gameName == "new" && req.user.name == userName) {

            console.log('readin')
            try {
                data = fs.readFileSync("./lib/data/gameData.txt", 'utf8', (err: any, dataRead: any) => {
                    return dataRead
                })
            } catch (e) {
                console.log('error')
                console.log(e)
                data = "error"
            }
        } else if (req.user.name == userName) {
            console.log('gettinGAME!')
            try {
                const getUser = await pool.query(`
                SELECT id FROM users WHERE username = '${userName}'
                `)
                const { id } = getUser.rows[0]
                const readGameData = await pool.query(`
                SELECT * FROM gamedata WHERE user_id = '${id}' AND game_name = '${gameName}'
                `)
                if (readGameData) res.status(200)
                res.json(readGameData.rows[0])
            } catch (e) {
                console.log(e)
                res.status(404)
                res.json('failed reading game')
            }
        }
        if (data) res.status(200)
        res.send(data)
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed loading gameData')
    }

})

app.get('/*', async (req: any, res: any) => {
    console.log('getAll')
    let contentGet = serverRenderer()
    console.log(contentGet.initialContent)
    console.log('hmmmm')
    console.log(req.body)
    res.render('index', { data: contentGet.initialContent });
})


app.listen(config.port, function listenHandler() {
    console.info(`Running on ${config.port}`)
})

export default app