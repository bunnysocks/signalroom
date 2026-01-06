import {Router} from "express";
const router = Router()

export default router.get("/", (_, res) => {
    res.send("welcome to my /room :)")
})