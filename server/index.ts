import 'dotenv/config'
import express from 'express'
import { parse } from 'url'
import { prepareNextApp } from './lib/next'

const app = express();

async function startServer() {
  const nextApp = await prepareNextApp()
  const nextHandler = nextApp.getRequestHandler()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/', (req, res) => {
    nextApp.render(req, res, '/index', parse(req.url, true).query)
  });

  app.get('*', (req, res) => {
    nextHandler(req, res, parse(req.url, true))
  })

  const port = process.env.PORT || 3001

  const server = app.listen(port, () => console.log(`listening on ${port}`))
}

startServer()