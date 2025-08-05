const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
const generateRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRE });
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || username.length < 4) {
        return res.status(400).json({ error: 'Username must be at least 4 characters long.' });
    } else if (!email || email.length < 8) {
        return res.status(400).json({ error: 'Email must be at least 8 characters long.' });
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email format is invalid.' });
    } else if (!password || password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not exist' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};