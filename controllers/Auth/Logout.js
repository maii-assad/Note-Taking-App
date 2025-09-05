const { SessionData } = require("../../models/session.model")

const Logout = async (req,res) => {
    try {
        const { sessionId } = req.body

        if (!sessionId) {
            return res.status(400).json({ error: 'Missing session ID' })
        }

        const session = await SessionData.findOne({ sessionId })
        if (!session) {
            return res.status(401).json({ error: 'Session not found' })
        }
    
        await session.remove()
        return res.status(200).json({ ok: true })
    } catch {
        return res.status(500).json({ error: 'Server error in Logout' })
    }
}

module.exports = {Logout}