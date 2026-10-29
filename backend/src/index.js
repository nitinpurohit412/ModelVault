const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes =  require('./routes/authRoutes')
const modelRoutes = require('./routes/modelRoutes')
const permissionRoutes = require("./routes/permissionRoutes")
const userRoutes = require('./routes/userRoutes')
const errorHandler = require("./middleware/errorMiddleware");
const app = express();



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req,res)=>{
    res.send("ModelVault API is running")
})





//* Routes
app.use("/api/auth", authRoutes)
app.use("/api/models", modelRoutes)
app.use("/api/permissions", permissionRoutes)
app.use("/api/users", userRoutes)

app.use(errorHandler);



//* Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

connectDB();