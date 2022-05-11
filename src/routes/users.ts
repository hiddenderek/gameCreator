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

router.get('/api/currentUser', authenticateToken, async (req: any, res: any) => {
    console.log('getCurrentUser')
    try {
        console.log("CURRENT USER: " + req.user)
        if (req?.user?.name  && req?.user?.name !== "[object Object]") {
            res.status(200)
            res.json(req.user.name)
            console.log('GOT USER!')
        } else {
            console.log('COULD NOT FIND USER')
            res.status(404)
            res.json('')
        }
    } catch (e) {
        console.log('FAILED GETTING USER')
        res.status(400)
        res.json('')
    }
})

router.get('/api/users', authenticateToken, async (req: any, res: any) => {
    console.log('getUsers')
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
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('Failed getting users.')
    }
})

router.get('/api/users/:userName', async (req: any, res: any) => {
    console.log('getUser')
    try {
        const { userName } = req.params
        console.log(userName)
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
        console.log(showUser?.rows[0])
        if (showUser?.rows[0]) {
            console.log('CURRENT USER:')
            console.log(showUser?.rows[0])
            res.status(200)
            res.json(showUser?.rows[0])
        } else {
            console.log('USER RETREIVAL FAILED.')
            res.status(404)
            res.json('Could not get user.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('Failed getting user.')
    }
})

router.post('/api/users/:userName', async (req: any, res: any) => {
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
        INSERT INTO users (id, username, password, date_of_birth, time_of_signup) VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE) RETURNING *
        `,[userName, hashedPassword, new Date(dateOfBirth)])
        console.log('savin')
        if (addUser) {
            res.status(200)
            res.json("Successful! User has been added")
        } else {
            res.status(404)
            res.json('Could not add user.')
        }
    } catch (e: any) {
        console.log(e.message)
        res.status(404)
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
    console.log('patchUser')
    try {
        const { userName } = req.params
        const userChange = req.body
        const columnType = Object.keys(userChange)[0]
        const updateUser = await pool.query(`
        UPDATE users SET ${columnType} = $1 WHERE username = $2 RETURNING *
        `, [userChange[columnType], userName])
        console.log('savin')
        if (updateUser.rows[0]) {
            res.status(200)
            res.json(updateUser.rows[0])
        } else {
            res.status(404) 
            res.json('Could not modify user.')
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('Failed modifying users.')
    }

})

router.delete('/api/users/:userName', authenticateToken, async (req: any, res: any) => {
    console.log('deleteUser')
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
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('failed deleting users')
    }

})

export default router