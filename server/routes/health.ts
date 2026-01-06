import e, { Router } from 'express'
const router = Router()

export default router.get("/", async (_, res) => {
    const healthCheck = {
        uptime : process.uptime(),
        timestamp : Date.now()
    }

    try {
        res.send(healthCheck)
    } catch (err) {
        res.send(503).send()
    }
})