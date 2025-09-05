const bcrypt = require('bcrypt')
const { UserData } = require("../../models/user.model")
const { SessionData } = require("../../models/session.model")

const getProfile = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const userData = await UserData.findOne({ username: user.username })
        if (!userData) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        res.status(200).json({ user: userData })
    } catch (error) {
        console.error("getProfile Error:", error)
        return res.status(500).json({ error: "Server error in getProfile" })
    }
}

const changePass = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { oldPassword, newPassword, comfirmPassword } = req.body
        if (!oldPassword || !newPassword || !comfirmPassword) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (newPassword !== comfirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong password" })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error("chamgePass Error:", error)
        return res.status(500).json({ error: "Server error in chamgePass" })
    }
}

const changeFLname = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { firstName, lastName } = req.body
        if (!firstName || !lastName) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const userData = await UserData.findOne({ username: user.username })
        if (!userData) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        userData.firstName = firstName
        userData.lastName = lastName
        await userData.save()

        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error("changeFLname Error:", error)
        return res.status(500).json({ error: "Server error in changeFLname" })
    }
}

const enableOtp = async (req,res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const userData = await UserData.findOne({ username: user.username })
        if (!userData) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        const { otpEnabled } = req.body
        if (otpEnabled === undefined) {
            return res.status(400).json({ message: "otpEnabled field is required" })
        }

        userData.otpEnabled = otpEnabled
        await userData.save()

        return res.status(200).json ({otpEnabled: userData.otpEnabled})
    } catch (error) {
        console.error("enableOtp Error:", error)
        return res.status(500).json({ error: "Server error in enableOtp" })
    }
}

module.exports = {getProfile, changePass, changeFLname, enableOtp}