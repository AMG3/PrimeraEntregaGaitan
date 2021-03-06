let cart = window.localStorage.getItem("cart");
let cartId = -1;
if (cart !== undefined && cart !== null) {
  cartId = JSON.parse(cart).id;
  cart = JSON.parse(cart).products;

  document.getElementById("delete-cart").addEventListener("click", () => {
    fetch("/api/carrito/" + cartId, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          window.localStorage.removeItem("cart");
          window.location.reload();
        } else {
          Swal.fire({
            title: "Error",
            text: res.message,
            icon: "error",
            timer: 2000,
          });
        }
      });
  });
}

cartItems = [];

fetch("/api/carrito/" + cartId + "/productos")
  .then((res) => res.json())
  .then((res) => {
    if (res.status === "success") {
      cartItems = res.payload.products;
      fetch("templates/cart.handlebars")
        .then((response) => response.text())
        .then((template) => {
          const templateFn = Handlebars.compile(template);
          const html = templateFn({ cart: cartItems });
          const formDiv = document.getElementById("cart");
          formDiv.innerHTML = html;

          document.querySelectorAll(".delete-button").forEach((item) => {
            item.addEventListener("click", (event) => {
              Swal.fire({
                text: "¿Deseas eliminar este producto?",
                showCancelButton: true,
                colorconfirmButtonText: "green",
                confirmButtonText: "Eliminar",
                colorcancelButtonText: "gray",
                cancelButtonText: "Cancelar",
              }).then((result) => {
                if (result.isConfirmed) {
                  fetch(
                    "/api/carrito/" + cartId + "/productos/" + item.dataset.id,
                    {
                      method: "DELETE",
                    }
                  ).then((_) => {
                    Swal.fire(
                      "¡Eliminado!",
                      "Producto eliminado.",
                      "success"
                    ).then((_) => {
                      window.location.reload();
                    });
                  });
                }
              });
            });
          });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: res.message,
        icon: "error",
        timer: 2000,
      });
    }
  });
