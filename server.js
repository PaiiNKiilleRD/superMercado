

import express from "express";
import mysql from "mysql2";
import { z } from "zod";

//* App
const app = express()
const port = 3000; //? 3000

app.use(express.static("src"));
app.use(express.json());

//* Config Db

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

    console.info("Conexion exitosa")
})

const articleSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    precio: z.number().nonnegative(),
    cantidad: z.number().int().nonnegative(),
    categoria: z.string().optional(),
    image: z.string().url().optional()
})

//* API Route

app.get("/productos", (req, res) => {
    db.query(`select * from productos`, (error, result) => {
        if (error) {
            return res.status(500).json({ error: err.message })
        }
        return res.json(result);
    })
});

// const body = document.querySelector("body");
// app.get("/", (red, res) => {
//     body.innerText = "Nada"
// })

app.get("/productos/buscar", (req, res) => {

    const { nombre, categoria } = req.query;

    let query = `select * from supermercado.productos where `

    const params = [];

    if (nombre) {
        query += `nombre = "${nombre}"`;
        // params.push(`${nombre}`)

    }
    if (categoria) {
        query += `categoria = "${categoria}"`;
        // params.push(`${categoria}`)
    }


    db.query(query, (error, result) => {

        console.log(query)

        if (error) {
            return res.status(500).json({ error: error.message })
        }
        return res.json(result);
    })
});



//* app.post();

//? app.delete();

//TODO app.put();

app.listen(port, () => {
    console.log(`Server is running http:localhost:${port}`)
})