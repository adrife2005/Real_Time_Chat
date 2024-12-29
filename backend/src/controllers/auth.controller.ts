import { Request, Response } from 'express';
import prisma from '../db/prisma';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

// @desc Get current user
// @route GET /api/auth/me
// @access Private
export const getMe = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic
    });
  } catch (error: Error | any) {
    console.log("Error in getMe controller" + error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const signup = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body;

    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      }
    })

    if (newUser) {
      generateToken(newUser.id, res);

      return res.status(201).json({ id: newUser.id, fullname: newUser.fullname, username: newUser.username, profilePic: newUser.profilePic });
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }

  } catch (error: Error | any) {
    console.log("Error in signup controller" + error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response): Promise<Response | any>  => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid password credentials' });
    }

    generateToken(user.id, res);

    return res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic
    });
  } catch (error: Error | any) {
    console.log("Error in login controller" + error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// @desc Logout user
// @route POST /api/auth/logout
// @access Public
export const logout = async (_req: Request, res: Response): Promise<Response | any> => {
  try {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: Error | any) {
    console.log("Error in login controller" + error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}