import { Router } from "express";
const router = Router()

export default router.get("/", async (_,res) => {
    const memUsage = process.memoryUsage()
    const logMessage = {
        status : 'Ok',
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    }

    try {
        res.send(logMessage)
    } catch (err) {
        logMessage.status = err
        res.send(503).send()
    }

})