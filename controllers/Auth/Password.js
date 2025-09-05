const crypto = require('crypto')
const { UserData } = require("../../models/user.model")

const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send("email required")
        }

        const user = await UserData.findOne({ email })
        if (!user) {
            return res.status(400).send("user not found")
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const expiry = Date.now() + 5 * 60 * 1000

        await UserData.findOneAndUpdate(
            { email: email },
            { passwordResetToken: resetToken, passwordResetTokenExpiry: expiry, },
            { new: true }
        )

        return res.status(200).json({ message: "Password reset token sent successfully", user })
    } catch (error) {
        console.error("ForgetPassword Error:", error)
        return res.status(500).json({ error: "Server error in ForgetPassword" })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send("Please Email required!!")
        }

        const user = await UserData.findOne({ email })
        if (!user) {
            return res.status(400).send("user not found!")
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 5 * 60 * 1000;
        await UserData.findOneAndUpdate(
            { email: email },
            { passwordResetToken: resetToken, passwordResetTokenExpiry: expiry },
            { new: true }
        );

        return res.status(200).json({ message: "Password reset token sent successfully!", user })
    } catch (error) {
        console.error("ResetPassword Error:", error)
        return res.status(500).json({ error: "Server error in ResetPassword" })
    }
}

module.exports = { ForgetPassword, ResetPassword }
