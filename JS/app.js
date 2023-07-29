//Declaro cosnt y let 
const contenedorProductos = document.querySelector("#contenedorProductos");
const botonesCategorias = document.querySelectorAll(".botonCategoria");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
let botonesAgregar = document.querySelectorAll(".productoAgregar");
const numero = document.querySelector("#numero");
const aside = document.querySelector('.aside');

// Función para cargar los productos mediante Fetch

let productos = [];
let productosEnCarrito;

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
                <img src="${producto.imagen[0]}" class="productoImage" alt="${producto.nombre}">
                <div class="productoDetalles">
                    <h3 class="productoTitulo">${producto.nombre}</h3>
                    <p class="productoPrecio">Precio $${producto.precio.toFixed(2)}</p>
                    <button class="productoAgregar" id="${producto.id}">Agregar al Carrito</button>
                </div>
            </div>`;

        contenedorProductos.append(div);
    });

}

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

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".productoAgregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumero();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
        },
        onClick: function () { } 
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumero = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numero.innerText = nuevoNumero;
}
/*
function agregarAlCarrito(productId) {
    const productoAgregado = productos.find(producto => producto.id === productId);

    if (productoAgregado) {
        if (productosEnCarrito.some(producto => producto.id === productId)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === productId);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }
        mostrarMensaje('Producto agregado al carrito'); 

        actualizarNumero();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}
*/
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
