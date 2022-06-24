import express from 'express'
import serverRenderer from './renderers/serverRender';
import config from './config'
import processEnv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
processEnv.config()
import useragent from 'express-useragent'
import https from 'https'
import gameActionsRouter from './routes/gameActions'
import gamesRouter from './routes/games'
import rankRouter from './routes/ranks'
import usersRouter from './routes/users'
const fs = require("fs")
const httpApp = express()
const app = express()
app.use(express.json({ limit: "2mb" }))
app.use(cors({
    credentials: true,
    origin: `https://${config.hostname}:${config.port}`
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(useragent.express());
app.use(gameActionsRouter)
app.use(gamesRouter);
app.use(rankRouter);
app.use(usersRouter)
app.set('view engine', 'ejs');



httpApp.get('/*', async(req: any, res: any)=>{
    console.log('https://' + req.hostname + ":" + config.port + req.url)
    res.redirect('https://' + req.hostname + ":" +  config.port + req.url)
})

httpApp.listen(config.httpPort, function listenHandler() {
    console.info(`Running on ${config.httpPort}`)
})

app.get('/*', async (req: any, res: any) => {
    console.log('getAll')
    let contentGet = serverRenderer()
    console.log(contentGet.initialContent)
    console.log('hmmmm')
    console.log(req.body)
    res.render('index', { data: contentGet.initialContent, isMobile: req.useragent.isMobile, isDesktop: req.useragent.isDesktop });
})

https.createServer({
    key: fs.readFileSync("./src/ssl/dchapman-portfolio_key.pem"),
    cert: fs.readFileSync("./src/ssl/dchapman-portfolio_site.crt")
  },app).listen(config.port, function listenHandler() {
      console.info(`Running on ${config.port}`)
  })

export default app