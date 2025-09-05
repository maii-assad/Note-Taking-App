const { v4: uuidv4 } = require('uuid')
const { SessionData } = require('../../models/session.model')
const { NoteData } = require('../../models/note.models')

//Get all notes for the authenticated user.
const getAllNotes = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const notes = await NoteData.find({ ownerUsername: user.username })
        if (!notes) {
            return res.status(401).json({ error: "User NOT Found!" })
        }

        return res.status(200).json({ notes })
    } catch (error) {
        console.error("getAllNotes Error:", error)
        return res.status(500).json({ error: "Server error in getAllNotes" })
    }
}

//Get a specific note by ID.
const getNoteById = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const note = await NoteData.findById(req.params.id)
        if (!note) {
            return res.status(401).json({ error: "Note NOT Found!" })
        }

        return res.status(200).json({ note })
    } catch (error) {
        console.error("getNoteById Error:", error)
        return res.status(500).json({ error: "Server error in getNoteById" })
    }
}

//Create a new note
const addNote = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { title, content, categoryName } = req.body
        if (!title || !content || !categoryName) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const note = new NoteData({
            title,
            content,
            categoryName,
            ownerUsername: user.username
        })
        await note.save()
        return res.status(200).json({ note })
    } catch (error) {
        console.error("addNote Error:", error)
        return res.status(500).json({ error: "Server error in addNote" })
    }
}

//Update a note completely (replace all fields).
const updateNote = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const note = await NoteData.findById(req.params.id)
        if (!note) {
            return res.status(401).json({ error: "Note NOT Found!" })
        }

        const { title, content, categoryName } = req.body
        if (!title || !content || !categoryName) {
            return res.status(400).json({ error: "All fields are required" })
        }

        note.title = title
        note.content = content
        note.categoryName = categoryName

        await note.save()
        return res.status(200).json({ note })
    } catch (error) {
        console.error("updateNote Error:", error)
        return res.status(500).json({ error: "Server error in updateNote" })
    }
}

//Partially update a note (update only provided fields).
//(all fields optional)

const updatePartially = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        let { id } = req.params;
        if (!id) {
            return res.status(400).send("ID is required")
        }

        const note = await NoteData.findOne({ ownerUsername: user.username, _id: id })
        if (!note) {
            return res.status(401).json({ error: "Note NOT Found!" })
        }

        const updates = {}
        if (req.body.title !== undefined) updates.title = req.body.title
        if (req.body.content !== undefined) updates.content = req.body.content
        if (req.body.categoryName !== undefined) updates.categoryName = req.body.categoryName

        if (Object.keys(updates).length === 0) {
            return res.status(400).send("No fields to update")
        }

        const updatenote = await NoteData.findOneAndUpdate(
            { _id: id, ownerUsername: user.username },
            { $set: updates },
            { new: true, runValidators: true }
        )

        await updatenote.save()
        return res.status(200).json({ updatenote })
    } catch (error) {
        console.error("updatePartially Error:", error)
        return res.status(500).json({ error: "Server error in updatePartially" })
    }
}

// Delete a note by ID.
const deleteNote = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const note = await NoteData.findOne({ ownerUsername: user.username, _id: id })
        if (!note) {
            return res.status(401).json({ error: "Note NOT Found!" })
        }

        await note.deleteOne({ ownerUsername: user.username, _id: id })
        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error("deleteNote Error:", error)
        return res.status(500).json({ error: "Server error in deleteNote" })
    }
}

module.exports = {
    getAllNotes,
    getNoteById,
    addNote,
    updateNote,
    updatePartially,
    deleteNote
}
