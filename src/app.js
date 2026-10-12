import express from "express";
import pool from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";


const app = express();



//parses incoming JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);


//Health Check endpoint

app.get("/health",(req,res) =>{
    res.status(200).json({
        success:true,
        message:"Subscriptly API is running",
        timestamp:new Date().toISOString(),
    });
});


app.get("/health/db",async(req,res)=>{
    try{
        const result =await pool.query("SELEct NOW() AS current_time");

        res.status(200).json({
            success:true,
            message:"PostgresSQL connected successfully",
            databaseTime:result.rows[0].current_time,
        });
        }catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
        code: error.code,
    });
    }
});
export default app;

