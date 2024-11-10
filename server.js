// root:
// dZhXUWjgqsgtTKZZPdUTguDlJUYRthfo
// @
// junction.proxy.rlwy.net
// :
// 18796
// /railway

import express from "express";
import mysql from "mysql2";
import { z } from "zod";

import cookieParser from 'cookie-parser'

//* App
const app = express()
const port = 3000; //? 3000

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser())

//* Config Db

const db = mysql.createConnection({
    host: "junction.proxy.rlwy.net",
    port: 18796,
    user: "root",
    password: "dZhXUWjgqsgtTKZZPdUTguDlJUYRthfo",
    database: "railway"
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

app.get("https://super-mercado-weld.vercel.app/productos", (req, res) => {
    db.query(`SELECT * FROM productos`, (error, result) => {
        if (error) {
            return res.status(500).json({ error: err.message })
        }
        return res.json(result);
    })
});

app.get("/productos/buscar", (req, res) => {

    const { nombre, categoria } = req.query;

    let query = `SELECT * FROM productos WHERE `

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

app.get("/categorias", (req, res) => {
    db.query(`SELECT DISTINCT categoria FROM productos`, (err, result) => {
        if (err) {
            return res.status(500).json({ err: err.message })
        }
        return res.json(result);
    })
});


app.post("/carrito/agregar", (req, res) => {
    const { id, nombre, precio, quantity = 1 } = req.body;

    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    const existItem = cart.find(item => item.id === id);


    if (existItem) {
        existItem.quantity += quantity;
    } else {
        cart.push({ id, nombre, precio, quantity });
    }
    console.log(cart)

    res.cookie("cart", JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie expires in 7 days
    res.json(cart);
});

app.get("/carrito", (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    res.json(cart);
})



//* app.post();

//? app.delete();

//TODO app.put();

app.listen(port, () => {
    console.log(`Server is running http:localhost:${port}`)
})