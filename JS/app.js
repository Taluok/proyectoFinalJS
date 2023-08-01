//Declaro cosnt y let 
const botonesCategorias = document.querySelectorAll(".botonCategoria");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
let botonesAgregar = document.querySelectorAll(".productoAgregar");
const numero = document.querySelector("#numero");
const aside = document.querySelector('.aside');

// Función para cargar los productos mediante Fetch

let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('./JSON/data.json');
        productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {

}));

// Función para mostrar los productos
function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('contenedorProductos');

    // Limpiar el contenedor de productos antes de agregar los nuevos
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <div class="productos">
                <img src="${producto.imagen}" class="productoImage" alt="${producto.titulo}">
                <div class="productoDetalles">
                    <h3 class="productoTitulo">${producto.titulo}</h3>
                    <p class="productoPrecio">Precio $${producto.precio.toFixed(2)}</p>
                    <button class="productoAgregar" id="${producto.id}">Agregar al Carrito</button>

                </div>
            </div>`;

        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

cargarProductos();

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const categoriaId = e.currentTarget.id;
        if (categoriaId !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === categoriaId);
            tituloPrincipal.innerText = e.currentTarget.innerText;
            mostrarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos();
        }

    })
});
//llamo la funsion dentro de cargar productos
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".productoAgregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

}
//productos que están guardados en el LocalStorage
let productosEnCarrito; 

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(productId) {
    Swal.fire({
        text: "Producto agregado",
        icon: "success",
        timer: 3000,
        position: "top-end",
        toast: true,
        showConfirmButton: false
    });

    const productoAgregado = productos.find(producto => producto.id === productId);
    let productoEnCarrito = productosEnCarrito.find(producto => producto.id === productId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        productoEnCarrito = {
            id: productoAgregado.id,
            titulo: productoAgregado.titulo,
            imagen: productoAgregado.imagen,
            precio: productoAgregado.precio,
            cantidad: 1
        };
        productosEnCarrito.push(productoEnCarrito);
    }

    actualizarNumerito();
    
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    const numerito = document.getElementById("numerito");
    if (numerito) {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.textContent = nuevoNumerito;
    }
}


function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".productoAgregar");

    botonesAgregar.forEach(boton => {
        const productId = boton.id; 
        boton.addEventListener("click", () => agregarAlCarrito(productId)); 
    });
}

// Función para mostrar un mensaje en pantalla (puedes usar SweetAlert2 o una alerta nativa)
function mostrarMensaje(mensaje) {
    // Ejemplo usando SweetAlert2
    Swal.fire({
        title: mensaje,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    });
}
