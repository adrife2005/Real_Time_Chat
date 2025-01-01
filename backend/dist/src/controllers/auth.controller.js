"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = exports.getMe = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc Get current user
// @route GET /api/auth/me
// @access Private
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in getMe controller" + error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getMe = getMe;
// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = yield prisma_1.default.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            }
        });
        if (newUser) {
            (0, generateToken_1.default)(newUser.id, res);
            return res.status(201).json({ id: newUser.id, fullname: newUser.fullname, username: newUser.username, profilePic: newUser.profilePic });
        }
        else {
            return res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        console.log("Error in signup controller" + error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.signup = signup;
// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = yield prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username credentials' });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid password credentials' });
        }
        (0, generateToken_1.default)(user.id, res);
        return res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in login controller" + error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
// @desc Logout user
// @route POST /api/auth/logout
// @access Public
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log("Error in login controller" + error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.logout = logout;
