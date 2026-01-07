import e, {Request, Response, NextFunction} from "express"
const app = e()
import healthRoute from "./routes/health.js"
import roomRoute from "./routes/room.js"
import metricsRoute from "./routes/metrics.js"
import dotenv from "dotenv"
import path from "path"
const PORT = process.env.PORT || 3000

const env = process.env.NODE_ENV || 'development'
const envPath = path.resolve(process.cwd(), `env${env === 'development' ? '' : '.' + env}`)
dotenv.config({path : envPath})
console.log(`Loading .env file ${envPath}`)

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
console.log(`Yo, ${process.env.PORT}`) //logging Yo, undefined


app.get("/", timeStampMiddleware, (_:Request, res:Response) => {
    res.send("haha")
})

app.use('/health', healthRoute)
app.use('/room', roomRoute)
app.use('/metrics', metricsRoute)

app.listen(PORT, () => {
    console.log(`server is listening on http://127.0.0.1:${PORT}`)
})

