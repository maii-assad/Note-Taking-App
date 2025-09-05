const { CategoryData } = require('../../models/category.model')
const { SessionData } = require('../../models/session.model')
const { NoteData } = require('../../models/note.models')

const getHome = async (req,res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const categories = await CategoryData.find({ ownerUsername: user.username })
        if (!categories) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        const notes = await NoteData.find({ ownerUsername: user.username })
        if (!notes) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        if (categories.length === 0 || notes.length === 0) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        return res.status(200).json({ categories, notes })
    } catch (error) {
        console.error("getHome Error:", error)
        return res.status(500).json({ error: "Server error in getHome" })
    }
}

module.exports = { getHome }