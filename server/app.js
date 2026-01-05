import e from "express"
const app = e()
const PORT = 3000
import healthRoute from "./routes/health.js"
import roomRoute from "./routes/room.js"
import metricsRoute from "./routes/metrics.js"

const fakeTasks = (fakeId) => {
    return new Promise( resolve => {
        setTimeout(() => resolve(`fakeData : ${fakeId}`), 1)
    }
    )
}

const fetchFakeDataParallely = async () => {
    console.time("parallel")
    const tasks = await Promise.all(
        Array.from({length: 1000}, (_, i) => fakeTasks(i))
    )
    console.timeEnd("parallel")
    return tasks
}

const runFakeFetch = async () => {
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


app.get("/", (_, res) => {
    res.send("haha")
})

app.use('/health', healthRoute)
app.use('/room', roomRoute)
app.use('/metrics', metricsRoute)

app.listen(PORT, () => {
    console.log(`server is listening on http://127.0.0.1:${PORT}`)
})
