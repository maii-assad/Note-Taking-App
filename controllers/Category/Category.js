const { CategoryData } = require('../../models/category.model')
const { SessionData } = require('../../models/session.model')
const { v4: uuidv4 } = require('uuid')

// Get all categories for the authenticated user.
const getAllCategories = async (req, res) => {
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

        return res.status(200).json({ categories })
    } catch (error) {
        console.error("getAllCategories Error:", error)
        return res.status(500).json({ error: "Server error in getAllCategories" })
    }
}

// Create a new category.
const createCategory = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const { name } = req.body
        if (!name) {
            return res.status(400).json({ error: "Category name is required" })
        }

        const category = new CategoryData({
            _id: uuidv4(),
            name,
            ownerUsername: user.username,
            createdAt: Date.now()
        })
        await category.save()
        return res.status(201).json({ ok: true })
    } catch (error) {
        console.error("createCategory Error:", error)
        return res.status(500).json({ error: "Server error in createCategory" })
    }
}

// Delete a category by ID.
const deleteCategory = async (req, res) => {
    try {
        const Token = req.headers.Token
        if (!Token) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const user = await SessionData.findOne({ token: Token })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        let { id } = req.params
        if (!id) return res.status(400).send("ID is required")

        const category = await CategoryData.findOne({ ownerUsername: user.username, _id: id })
        if (!category) {
            return res.status(401).json({ error: "Category NOT Found!" })
        }

        await category.deleteOne({ ownerUsername: user.username, _id: id })
        return res.status(200).json({ ok: true })
    } catch (error) {
        console.error("deleteCategory Error:", error)
        return res.status(500).json({ error: "Server error in deleteCategory" })
    }
}


module.exports = {
    getAllCategories,
    createCategory,
    deleteCategory
}
