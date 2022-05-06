import express from 'express'
import jwt from 'jsonwebtoken'
import PoolGet from 'pg'
const Pool = PoolGet.Pool
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "localhost",
    port: 5432,
    database: "gamecreator"
})
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

router.get('/api/games/:userName/:gameName/scores', async (req: any, res: any) => {
    try {
        const {userName, gameName} = req.params
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = $1
        `, [gameName])

        const gameId = getGameId?.rows[0]?.id 

        const getGameScores = await pool.query(`
            SELECT g.score, u.username FROM gamescores g LEFT JOIN users u ON g.user_id = u.id WHERE g.game_id = $1 ORDER BY g.score ASC LIMIT 10
        `, [gameId])
        if (getGameScores.rows[0]) {
            res.status(200)
            res.json(getGameScores.rows)
        }
        console.log(getGameScores)
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed getting scores')
    }
})

router.post('/api/games/:userName/:gameName/scores/:curUser', authenticateToken, async (req: any, res: any) => {
    try {
        const { userName, gameName, curUser } = req.params
        const { score } = req.body
        console.log(userName, gameName, curUser, score)
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = $1
        `, [gameName])

        const gameId = getGameId?.rows[0]?.id

        const getUserId = await pool.query(`
        SELECT id FROM users WHERE username = $1
        `, [curUser])

        const userId = getUserId?.rows[0]?.id
        console.log(userId, gameId)
        if (gameId && userId && req.user.name == curUser) {
            let oldScore = 1000000
            const getOldScore = await pool.query(`
            SELECT score FROM gamescores WHERE game_id = $1 AND user_id = $2
            `, [gameId, userId])
            if (getOldScore.rows[0]) {
                oldScore = getOldScore.rows[0].score
            }
            const parameters = score < oldScore ? [score, gameId, userId, score] : [score, gameId, userId]
            const postNewScore = await pool.query(`
            INSERT INTO gamescores (id, score, game_id, user_id) VALUES (uuid_generate_v4(), $1, $2, $3) ON CONFLICT (game_id, user_id) ${score < oldScore ? `DO UPDATE SET score = $4` : 'DO NOTHING'}
            `, parameters)
            if (postNewScore.rows[0]) {
                console.log(postNewScore.rows[0])
                res.status(200)
                res.json(postNewScore.rows[0])
            } else {
                res.status(404)
                res.json('Could not set high score.')
            }
        } else {
            res.status(404)
            res.json('Failed setting high score.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('Failed setting high score.')
    }
})

router.get('/api/games/:userName/:gameName/:curUser/actions', authenticateToken, async (req: any, res: any) => {
    console.log('getCurUserGameAction')
    try {
        const {userName, gameName, curUser} = req.params
        if (curUser === req?.user?.name) {
            const getGameId = await pool.query(`
            SELECT id FROM gamedata WHERE game_name = $1
            `, [gameName])
    
            const gameId = getGameId?.rows[0]?.id
    
            const getUserId = await pool.query(`
            SELECT id FROM users WHERE username = $1
            `, [curUser])

            const userId = getUserId?.rows[0]?.id

            const getCurUserGameAction = await pool.query(`
            SELECT action FROM gameactions WHERE game_id = $1 AND user_id = $2
            `, [gameId, userId])
            if (getCurUserGameAction.rows[0]) {
                res.status(200)
                res.json(getCurUserGameAction.rows[0].action)
            } else {
                res.status(404)
                res.json('Could not find game action.')
            }
        } else {
            res.status(404)
            res.json('Failed getting user actions. User name provided does not match logged in user.')
        }
    } catch (e) {
        res.status(400)
        res.json('Failed getting user actions.')
    }
})

router.get('/api/games/:userName/:gameName/actions/:action', async (req: any, res: any) => {
    console.log('getLikes')
    try {
        const { userName, gameName, action } = req.params
        const getGameId = await pool.query(`
        SELECT id FROM gamedata WHERE game_name = $1 
        `, [gameName])
        const gameId = getGameId.rows[0]?.id
        const addAction = await pool.query(`
        SELECT * FROM gameactions WHERE game_id = $1 AND action = $2
        `, [gameId, action])
        if (addAction?.rows) {
            res.status(200)
            res.json(addAction?.rows?.length)
        } else {
            res.json(404)
            res.json('Could not get likes.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('Failed getting likes')
    }
})
router.post('/api/games/:userName/:gameName/actions/:action', authenticateToken, async (req: any, res: any) => {
    console.log('addLikes')
    try {
        console.log('gameAction!')
        const { userName, gameName, action } = req.params
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
        const addAction = await pool.query(`
        INSERT INTO gameactions (id, action, game_id, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET action = $5
        `, [`${gameId}${userId}`, action, gameId, userId, action])
        if (addAction) {
            res.status(200)
            res.json(addAction.rows[0])
        } else {
            res.status(404)
            res.json('Failed liking game.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed liking game')
    }
})

export default router