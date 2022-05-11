import express from 'express'
import PoolGet from 'pg'
const Pool = PoolGet.Pool
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "postgres",
    port: 5432,
    database: "gamecreator"
})
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

router.get('/api/trending', async (req: any, res: any) => {
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
        if (trendingGames.rows) {
            res.status(200)
            res.json(trendingGames.rows)
        } else {
            res.status(404)
            res.json('Could not get trending games.')
        }
    } catch (e) {
        res.status(400)
        res.json('Failed getting trending games.')
        console.log(e)
    }
})

router.get('/api/ranks/scores', async (req: any, res: any) =>{
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
            res.status(404) 
            res.json('No scores available.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('failed getting ranks')
    }
})
router.get('/api/ranks/plays', async (req: any, res: any) => {
    try {
        console.log('gettingRanks!')
        const getRanks = await pool.query(`
        SELECT * FROM (
                SELECT DISTINCT u.username, 
                SUM(CASE WHEN u.id = d.user_id THEN d.plays ELSE NULL END)::int AS play_count
                FROM users u, gamedata d GROUP BY u.id
        ) AS Q1  WHERE play_count IS NOT NULL ORDER BY play_count DESC LIMIT 25 
        `)
        console.log('ranks: ')
        console.log(getRanks)
        if (getRanks.rows) {
            res.status(200)
            res.json(getRanks.rows)
        } else {
            res.status(404)
            res.json('failed getting ranks.')
            console.log('failed getting ranks')
        }
    } catch (e) {
        res.status(400)
        res.json('failed getting ranks: ' + e)
    }
})

router.get('/api/ranks/likes', async (req: any, res: any) => {
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
        } else {
            res.status(404)
            res.json('Could not get likes.')
        }
    } catch (e) {
        res.status(404)
        res.json('failed getting ranks: ' + e)
    }
})

export default router