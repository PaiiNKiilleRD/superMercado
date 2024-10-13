

import express from "express";
import mysql from "mysql2";
import { z } from "zod";

// App
const app = express()
const port = 4321; // 3000

app.use(express.json());

// Config Db

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "thebest1704qQ!",
    database: "superMercado"
})

db.connect(err => {
    if (err) {
        console.log(`Error ${err}`);
        return
    }

    console.info("Exitoso")
})



