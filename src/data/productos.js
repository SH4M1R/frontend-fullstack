export const productos = [
  {
    idProducto: 1,
    Producto: "Camiseta Deportiva",
    PrecioCompra: 20.5,
    PrecioVenta: 35.0,
    Stock: 50,
    Descripcion: "Camiseta ligera de material transpirable",
    Talla: "M",
    Color: "Azul",
    Foto: "https://via.placeholder.com/80",
    Genero: true, // true = masculino, false = femenino
    categoria: { idCategoria: 1, nombre: "Ropa" }
  },
  {
    idProducto: 2,
    Producto: "Zapatillas Running",
    PrecioCompra: 80.0,
    PrecioVenta: 120.0,
    Stock: 30,
    Descripcion: "Zapatillas con amortiguación avanzada",
    Talla: "42",
    Color: "Negro",
    Foto: "https://via.placeholder.com/80",
    Genero: true,
    categoria: { idCategoria: 2, nombre: "Calzado" }
  },
  {
    idProducto: 3,
    Producto: "Leggings Deportivos",
    PrecioCompra: 25.0,
    PrecioVenta: 45.0,
    Stock: 40,
    Descripcion: "Leggings ajustados para entrenamiento",
    Talla: "S",
    Color: "Gris",
    Foto: "https://via.placeholder.com/80",
    Genero: false,
    categoria: { idCategoria: 1, nombre: "Ropa" }
  },
  {
    idProducto: 4,
    Producto: "Sudadera con Capucha",
    PrecioCompra: 35.0,
    PrecioVenta: 60.0,
    Stock: 20,
    Descripcion: "Sudadera cálida de algodón",
    Talla: "L",
    Color: "Negro",
    Foto: "https://via.placeholder.com/80",
    Genero: true,
    categoria: { idCategoria: 1, nombre: "Ropa" }
  },
  {
    idProducto: 5,
    Producto: "Mochila Urbana",
    PrecioCompra: 40.0,
    PrecioVenta: 70.0,
    Stock: 15,
    Descripcion: "Mochila resistente para uso diario",
    Talla: "-",
    Color: "Rojo",
    Foto: "https://via.placeholder.com/80",
    Genero: true,
    categoria: { idCategoria: 3, nombre: "Accesorios" }
  }
];