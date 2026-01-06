import e, {Request, Response, NextFunction} from "express"
const app = e()
const PORT = 3000
import healthRoute from "./routes/health"
import roomRoute from "./routes/room"
import metricsRoute from "./routes/metrics"

const fakeTasks = (fakeId : number) : Promise<string> => {
    return new Promise( resolve => {
        setTimeout(() => resolve(`fakeData : ${fakeId}`), 1)
    }
    )
}

const timeStampFn = async () : Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(`Middleware Logged at ${new Date().toTimeString()}`))
    })
}

const timeStampMiddleware = async  (req : Request,res : Response,next : NextFunction) : Promise<void> => {
    const timeStamp =  await timeStampFn()
    console.log(timeStamp)
    next()
}

const fetchFakeDataParallely = async () : Promise<string[]> => {
    console.time("parallel")
    const tasks = await Promise.all(
        Array.from({length: 1000}, (_, i) => fakeTasks(i))
    )
    console.timeEnd("parallel")
    return tasks
}

const runFakeFetch = async () : Promise<void> => {
    const fakeData = await fetchFakeDataParallely()
    console.log(fakeData)
    console.log("actually doneFetching...")
}

const NonBlockingFn = () => {
    console.log("startFetching...")
    runFakeFetch()
    console.log("doneFetching...")
}

// Function handles 1000-Fake Async Tasks without Blocking
NonBlockingFn()


app.get("/", timeStampMiddleware, (_:Request, res:Response) => {
    res.send("haha")
})

app.use('/health', healthRoute)
app.use('/room', roomRoute)
app.use('/metrics', metricsRoute)

app.listen(PORT, () => {
    console.log(`server is listening on http://127.0.0.1:${PORT}`)
})
