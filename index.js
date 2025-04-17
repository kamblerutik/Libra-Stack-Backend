import "dotenv/config"
import "module-alias/register.js"
import express from "express"
import cors from "cors"
import router from "./src/routes/routes.js";
import connect from "./src/lib/db.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors())
app.use("/api", router)

connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port} or visit http://localhost:${port}`); 
    })
})
