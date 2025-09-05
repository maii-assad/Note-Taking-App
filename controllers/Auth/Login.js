const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { SessionData } = require("../../models/session.model")
const { UserData } = require("../../models/user.model")

// Start Login
const LoginStart = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: 'Missing username or password' })
        }
    
        const user = await UserData.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Wrong password' })
        }

        if (user.otp !== null)
            return res.status(400).send("OTP already sent, please verify")

        const newOtp = Math.floor(100000 + Math.random() * 900000)
        user.otp = newOtp
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        await user.save()

        return res.status(200).json({ message: 'OTP sent successfully', user })
    } catch (err) {
        console.error("LoginStart error:", err)
        return res.status(500).json({ error: "Server error in LoginStart" })
    }
}

// Verify Login

const LoginVerify = async (req, res) => {
    try {
        const { username, otpCode } = req.body
        if (!username || !otpCode)
            return res.status(400).send("Missing username or OTP code")

        const user = await UserData.findOne({ username })
        if (!user) {
            return res.status(404).send("User not found")
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(401).send("No active OTP")
        }

        if (user.otpExpiry < new Date()) {
            user.otp = null
            user.otpExpiry = null
            await user.save()
            return res.status(401).send("OTP expired")
        }

        otpCode = otpCode.toString().trim()
        if (user.otp.toString() !== otpCode) {
            return res.status(401).send("Invalid OTP code")
        }

        user.otp = null
        user.otpExpiry = null
        await user.save()

        const accessToken = crypto.randomBytes(32).toString("hex")
        const newSession = new SessionData({
            username: user.username,
            token: accessToken,
            role: user.role
        })
        await newSession.save()

        return res.status(200).json({
            message: "Login successful",
            user,
            token: accessToken
        })
    } catch (err) {
        console.error("LoginVerify error:", err)
        return res.status(500).json({ error: "Server error in LoginVerify" })
    }
}

module.exports = { LoginStart, LoginVerify }
