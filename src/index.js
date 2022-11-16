const express = require("express");

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorV2 = require('./ContenedorV2.js')
const ContenedorV2escribir = require('./ContenedorV2escribir.js')

// const handlebars = require('express-handlebars')

const app = express();
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

let contenedor= new ContenedorV2()
let mensajes= new ContenedorV2escribir('texto.json')

//configurar socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    // mostrar productos
    socket.emit('productos', contenedor.getAll());

    // actualizar productos
    socket.on('update', producto => {
        contenedor.save(producto)
        io.sockets.emit('productos', contenedor.getAll());
    })

    // mostrar mensajes
    socket.emit('mensajes', await mensajes.getAll());

    // actualizar mensajes
    socket.on('nuevo_mensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajes.save(mensaje)
        io.sockets.emit('mensajes', await mensaje.getAll());
    })
});


// middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

let producto ={
    title: "Escuadra",
    price: 123.45,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
}
let producto2 ={
    title: "Calculadora",
    price: 234.56,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
}
let producto3 ={
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
}


contenedor.save(producto)
contenedor.save(producto2)
contenedor.save(producto3)


// app.engine(
//     "hbs",
//     handlebars.engine({
//         extname: ".hbs",
//         defaultLayout: 'layout.hbs',
//     })
// );

// // view engine setup
// app.set('views', path.join(__dirname, 'public/views'));
// app.set('view engine', 'hbs');

// // app.set("view engine", "hbs");
// // app.set("views", "./views");


// app.post('/productos', (req, res) => {
//     let producto = req.body
//     contenedor.save(producto)
//     res.redirect('/')
// })


// app.get('/productos', (req, res) => {
//   let result = contenedor.getAll()  
  
//   res.render("view1", {
//         productos: result,
//         hayProductos: result.length
//   });
// });


const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
