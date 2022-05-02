// Importación de dependencias
const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs')
const PORT = 3000;
// Servidor inicializado en puerto 3000
app.listen(PORT, () => console.log(`Servidor inicializado en puerto ${PORT}`))

// Middleware y configuración
app.use(expressFileUpload({
    limits: { fileSize: 5000000 }, // Se establece un peso maximo por archivo de 5MB 
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo que deseas subir intensa subir, supera el limite permitido',
}));

// Middleware body-parser para la manipulación del payload mediante la propiedad propiedad req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Carpeta public
app.use(express.static("public"));

// Disponibiliza ruta raíz
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

// Disponibiliza ruta POST "/imagen" para almacenar una imagen en la carpeta public
app.post('/imagen', (req, res) => {
    console.log(req.body)
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/img/imagen-${posicion}.jpg`, (err) => {
        res.redirect('/collage');
    });
});

// Disponibiliza ruta GET "/imagen"
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/collage.html')

})

// Disponibiliza ruta GET "/deleteImg/:nombre" que recibe como parámetro el nombre de la imagen y la elimine al hacerle click.
app.delete("/imagen/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imagenes/${nombre}.jpg`, (err) => {
        res.send(`Imagen ${nombre} fue eliminada con éxito`);
    });
});

// Disponibiliza ruta GET "/deleteImg/:nombre" que recibe como parametro el nombre de la imagen y la elimine
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/img/${nombre}`, (err) => {
        res.redirect("/collage")
    });
});

// Disponibiliza rutas no declaradas
app.get('*', (req, res) => {
    res.send(`<br><center><h1>Pagina no encontrada 404</h1></center>`)
})
