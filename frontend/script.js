const productsContainer = document.getElementById("products");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch("http://localhost:5000/products")
  .then(res => res.json())
  .then(products => {
    products.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("col-md-4");
      div.innerHTML = `
        <div class="card h-100">
          <img src="assets/images/product${p._id}.jpg" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">Price: ₹${p.price}</p>
            <button class="btn btn-primary w-100" onclick="addToCart('${p._id}')">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      productsContainer.appendChild(div);
    });
  });

function addToCart(id){
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}