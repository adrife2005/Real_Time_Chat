import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import { app, server } from './socket/socket'

dotenv.config()

const PORT = process.env.PORT ?? 3001

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
})