const connectToMongo = require("./db")
const express = require("express")

connectToMongo()

const app = express()
const port = 5132

app.use(express.json())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))





app.listen(port,()=>{
    console.log(`Server started on port ${port} http://localhost:${port}`);
})