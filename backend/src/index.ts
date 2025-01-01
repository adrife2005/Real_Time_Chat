import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import { app, server } from './socket/socket'
import path from "path"


dotenv.config()

const PORT = process.env.PORT ?? 3001
const __dirname = path.resolve()

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
}

server.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
})