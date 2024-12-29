import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})