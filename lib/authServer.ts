import express from 'express'
import jwt from 'jsonwebtoken'
import config from './config'
import processEnv from 'dotenv'
import cors from 'cors'
import dayjs from 'dayjs'
import cookieParser from 'cookie-parser'
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

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: `http://localhost:${config.port}`
}));

interface userObj {
    name: string
}
app.post('/token', async (req, res) => {
    try {
        console.log('GET NEW TOKEN')
        const { refreshToken } = JSON.parse(req.cookies.secureCookie)
        if (refreshToken == null) return res.sendStatus(401)
        //checks if the refresh token is included in the list of valid refresh tokens. If it isnt, send a 403 error.  
        const saveToken = await pool.query(`
        SELECT * FROM refreshtokens WHERE refresh_token = '${refreshToken}'
        `)
        if (!(saveToken.rows.length > 0)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ name: user!.name })
            const JWT = { accessToken: accessToken, refreshToken: refreshToken }
            res.cookie("secureCookie", JSON.stringify(JWT), {
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                expires: dayjs().add(1, "days").toDate(),
            });
            res.json('Refresh successful!')
        })

    } catch (e) {
        console.log(e)
    }
})
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user: userObj = { name: username }
        console.log(process.env.REFRESH_TOKEN_SECRET)
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string)
        const JWT = { accessToken: accessToken, refreshToken: refreshToken }
        const getUser = await pool.query(`
        SELECT * FROM users WHERE username = '${username}'
        `)
        if (getUser.rows[0]) {
            const userId = getUser.rows[0].id
            const storedPassword = getUser.rows[0]?.password
            const validPassword = await bcrypt.compare(password, storedPassword)
            if (validPassword) {
                const deleteExisting = await pool.query(`
                DELETE FROM refreshtokens WHERE user_id = '${userId}'
                `)
                //adds this refresh token to the list of valid refresh tokens. Use a database table in real use.
                const saveToken = await pool.query(`
                INSERT INTO refreshtokens (id, refresh_token, user_id) VALUES (uuid_generate_v4(), '${refreshToken}', '${userId}')
                `)
                console.log(saveToken)
                //res.json({ accessToken: accessToken, refreshToken: refreshToken })
                res.cookie("secureCookie", JSON.stringify(JWT), {
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    expires: dayjs().add(1, "days").toDate(),
                });
                res.status(200)
                res.json('Login successful!')
            } else {
                res.status(404)
                res.json('Login failed.')
            }
        } else {
            res.status(404)
            res.json('Login failed.')
        }
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json('Login failed.')
    }
})

app.delete('/logout', async (req, res) => {
    console.log('logout')
    try {
        const { refreshToken } = JSON.parse(req.cookies.secureCookie)
        if (refreshToken == null) return res.sendStatus(401)
        const deleteToken = await pool.query(`
        DELETE FROM refreshtokens WHERE refresh_token = '${refreshToken}'
        `)
        res.clearCookie("secureCookie")
        return res.sendStatus(204)
    } catch (e) {
        console.log(e)
    }
})
function generateAccessToken(user: userObj) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' })
}

app.listen(config.authPort, function listenHandler() {
    console.info(`Running on ${config.authPort}`)
})