import e, { Router } from 'express'
const router = Router()

export default router.get("/", async (_, res) => {
    const healthCheck = {
        uptime : process.uptime(),
        message : 'Ok',
        timestamp : Date.now()
    }

    try {
        res.send(healthCheck)
    } catch (err) {
        healthCheck.message = err,
        res.send(503).send()
    }
})