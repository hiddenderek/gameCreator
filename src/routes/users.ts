import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
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

function authenticateToken(req: any, res: any, next: any) {
    const token = JSON.parse(req.cookies.secureCookie)
    if (token == null) {
        console.log('NULL AUTHENTICATE')
        return res.sendStatus(401)
    }
    jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log('ERROR AUTHENTICATING: ' + err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

router.get('/api/currentUser', authenticateToken, async (req: any, res: any) => {
    try {
        if (req?.user?.name  && req?.user?.name !== "[object Object]") {
            res.status(200)
            res.json(req.user.name)
        } else {
            res.status(404)
            res.json('')
        }
    } catch (e: any) {
        console.log('Failed getting current user: ' + e.message)
        res.status(400)
        res.json('')
    }
})

router.get('/api/users', authenticateToken, async (req: any, res: any) => {
    try {
        const showUsers = await pool.query(`
        SELECT * FROM users
        `)
        if (showUsers.rows) {
            res.status(200)
            res.json(showUsers.rows)
        } else {
            res.status(404)
            res.json('Could not get users.')
        }
    } catch (e: any) {
        console.log('Failed getting users: ' + e.message)
        res.status(404)
        res.json('Failed getting users.')
    }
})

router.get('/api/users/:userName', async (req: any, res: any) => {
    try {
        const { userName } = req.params
        let showUser
        if (userName.length <= 30 && userName !== "[object Object]") {
            showUser = await pool.query(`
            SELECT username, time_of_signup, date_of_birth FROM users WHERE username = $1
            `,[userName])
        } else if (userName.length > 30 && userName !== "[object Object]") {
            showUser = await pool.query(`
            SELECT username, time_of_signup, date_of_birth FROM users WHERE id = $1
            `,[userName])
        }
        if (showUser?.rows[0]) {
            res.status(200)
            res.json(showUser?.rows[0])
        } else {
            res.status(404)
            res.json('Could not get user.')
        }
    } catch (e: any) {
        console.log('Failed getting user: ' + e.message)
        res.status(500)
        res.json('Failed getting user.')
    }
})

router.post('/api/users/:userName', async (req: any, res: any) => {
    try {
        const { userName } = req.params
        const { password } = req.body
        const { dateOfBirth } = req.body
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const addUser = await pool.query(`
        INSERT INTO users (id, username, password, date_of_birth, time_of_signup) VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE) RETURNING *
        `,[userName, hashedPassword, new Date(dateOfBirth)])
        if (addUser) {
            res.status(200)
            res.json("Successful! User has been added")
        } else {
            res.status(404)
            res.json('Could not add user.')
        }
    } catch (e: any) {
        console.log('Failed creating user: ' + e.message)
        res.status(500)
        if (e.message.match('violates unique constraint') && e.message.match('password')) {
            res.json('Failed. Password must be unique.')
        } else if (e.message.match('violates unique constraint') && e.message.match('username')) {
            res.json('Failed. Username must be unique.')
        } else {
            res.json('Failed. Unknown errror.')
        }
    }
})

router.patch('/api/users/:userName', authenticateToken, async (req: any, res: any) => {
    try {
        const { userName } = req.params
        const userChange = req.body
        const columnType = Object.keys(userChange)[0]
        const updateUser = await pool.query(`
        UPDATE users SET ${columnType} = $1 WHERE username = $2 RETURNING *
        `, [userChange[columnType], userName])
        if (updateUser.rows[0]) {
            res.status(200)
            res.json(updateUser.rows[0])
        } else {
            res.status(404) 
            res.json('Could not modify user.')
        }
    } catch (e: any) {
        console.log('Failed modifying users: ' + e.message)
        res.status(404)
        res.json('Failed modifying users.')
    }

})

router.delete('/api/users/:userName', authenticateToken, async (req: any, res: any) => {
    try {
        const { userName } = req.params
        const updateUser = await pool.query(`
        DELETE FROM users WHERE username = $1 RETURNING *
        `, [userName])
        if (updateUser.rows[0]) {
            res.status(200)
            res.json(updateUser.rows[0])
        } else {
            res.status(404)
            res.json('could not delete user.')
        }
    } catch (e: any) {
        console.log('Failed deleting users: ' + e.message)
        res.status(404)
        res.json('failed deleting users')
    }

})

export default router