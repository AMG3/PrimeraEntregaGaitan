import { app } from "./services/express.js";
import cors from "cors";
import productRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import express from "./services/express.js";
import { __dirname, returnMessage } from "./middlewares.js";

let administrador = false;
app.use((req, res, next) => {
  req.auth = administrador;
  next();
});

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static(__dirname + "/public/"));

app.use("/api/productos", productRouter);
app.use("/api/carrito", cartRouter);

app.get("/login", (req, res) => {
  if (administrador !== true) {
    administrador = true;
  }
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  if (administrador === true) {
    administrador = false;
  }
  res.redirect("/");
});

app.get("/isLogin", (req, res) => {
  res.json(administrador);
});

app.use((req, res) => {
  res.send(returnMessage(true, "Ruta no encontrada", null));
});
