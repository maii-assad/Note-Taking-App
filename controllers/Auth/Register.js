const bcrypt = require("bcrypt")
const { UserData } = require("../../models/user.model")

const Register = async (req,res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body

        if (!username || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserData({
            username,
            email,
            password: hashedPassword,
            role: "user" ,
            firstName,
            lastName,
            phoneNumber,
            address,
        });
        await newUser.save()
        return res.status(201).json({ ok: true })

    } catch {
        return res.status(500).json({ error: "Server error in Register" })
    }
}

module.exports = { Register }
