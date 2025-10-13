// contentScript.js

// Create floating button
const sellpalBtn = document.createElement("button");
sellpalBtn.id = "sellpalEscrowBtn";
sellpalBtn.innerText = "Pay with SellPal Escrow";
sellpalBtn.style.position = "fixed";
sellpalBtn.style.bottom = "20px";
sellpalBtn.style.right = "20px";
sellpalBtn.style.background = "#008000"; // green
sellpalBtn.style.color = "white";
sellpalBtn.style.border = "none";
sellpalBtn.style.padding = "12px 18px";
sellpalBtn.style.borderRadius = "10px";
sellpalBtn.style.zIndex = "9999";
sellpalBtn.style.cursor = "pointer";
sellpalBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
sellpalBtn.style.fontWeight = "bold";

document.body.appendChild(sellpalBtn);

// Create modal container
const modal = document.createElement("div");
modal.id = "sellpalModal";
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.backgroundColor = "rgba(0,0,0,0.5)";
modal.style.zIndex = "10000";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";

// Modal content
const modalContent = document.createElement("div");
modalContent.style.background = "#f5f5dc"; // beige
modalContent.style.padding = "20px";
modalContent.style.borderRadius = "10px";
modalContent.style.width = "400px";
modalContent.style.maxWidth = "90%";
modalContent.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
modalContent.style.position = "relative";

// Close button
const closeBtn = document.createElement("span");
closeBtn.innerHTML = "&times;";
closeBtn.style.position = "absolute";
closeBtn.style.top = "10px";
closeBtn.style.right = "15px";
closeBtn.style.fontSize = "24px";
closeBtn.style.cursor = "pointer";
modalContent.appendChild(closeBtn);

const form = document.createElement("form");
form.id = "sellpalCheckoutForm";

// Form fields
const fields = [
  {label: "Buyer Name", id: "name", type: "text"},
  {label: "Buyer Email", id: "email", type: "email"},
  {label: "Seller Email", id: "sellerEmail", type: "email"},
  {label: "Item Description", id: "item", type: "text"},
  {label: "Amount (KES)", id: "amount", type: "number"}
];

fields.forEach(f => {
  const label = document.createElement("label");
  label.textContent = f.label;
  label.style.display = "block";
  label.style.marginTop = "10px";
  label.style.fontWeight = "bold";
  label.style.color = "#008080"; // teal
  form.appendChild(label);

  const input = document.createElement("input");
  input.type = f.type;
  input.id = f.id;
  input.required = true;
  input.style.width = "100%";
  input.style.padding = "8px";
  input.style.borderRadius = "5px";
  input.style.border = "1px solid #ccc";
  form.appendChild(input);
});

const submitBtn = document.createElement("button");
submitBtn.type = "submit";
submitBtn.innerText = "Pay with SellPal Escrow";
submitBtn.style.background = "#008000";
submitBtn.style.color = "white";
submitBtn.style.border = "none";
submitBtn.style.padding = "12px";
submitBtn.style.borderRadius = "8px";
submitBtn.style.marginTop = "15px";
submitBtn.style.width = "100%";
submitBtn.style.cursor = "pointer";

form.appendChild(submitBtn);

const messageDiv = document.createElement("div");
messageDiv.id = "sellpalMessage";
messageDiv.style.marginTop = "15px";
messageDiv.style.padding = "10px";
messageDiv.style.borderRadius = "5px";
messageDiv.style.display = "none";
form.appendChild(messageDiv);

// Release funds button
const releaseBtn = document.createElement("button");
releaseBtn.id = "releaseFunds";
releaseBtn.innerText = "Release Funds";
releaseBtn.style.display = "none";
releaseBtn.style.background = "#20b2aa"; // teal
releaseBtn.style.color = "white";
releaseBtn.style.border = "none";
releaseBtn.style.padding = "12px";
releaseBtn.style.borderRadius = "8px";
releaseBtn.style.marginTop = "10px";
releaseBtn.style.width = "100%";
releaseBtn.style.cursor = "pointer";
form.appendChild(releaseBtn);

modalContent.appendChild(form);
modal.appendChild(modalContent);
document.body.appendChild(modal);

let currentOrderID = null;

// Event listeners
sellpalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  messageDiv.style.display = "none";
  form.reset();
  releaseBtn.style.display = "none";
  currentOrderID = null;
});

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    name: form.name.value,
    email: form.email.value,
    sellerEmail: form.sellerEmail.value,
    item: form.item.value,
    amount: form.amount.value
  };
  console.log("📤 Checkout form submitted via SellPal Escrow", formData);

  try {
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log("📥 Response:", data);

    if(data.success){
      currentOrderID = data.orderID;
      messageDiv.style.display = "block";
      messageDiv.style.background = "#e0f7f7";
      messageDiv.style.color = "#008080";
      messageDiv.innerHTML = `✅ Deposit successful!<br>Order ID: <strong>${data.orderID}</strong><br>Click "Release Funds" when the item is delivered.`;
      releaseBtn.style.display = "block";
      form.reset();
    } else {
      messageDiv.style.display = "block";
      messageDiv.style.background = "#ffe0e0";
      messageDiv.style.color = "#800000";
      messageDiv.textContent = `❌ Error: ${data.error}`;
    }
  } catch(err){
    console.error("❌ Checkout error:", err);
    messageDiv.style.display = "block";
    messageDiv.style.background = "#ffe0e0";
    messageDiv.style.color = "#800000";
    messageDiv.textContent = `❌ Network Error: ${err.message}`;
  }
});

// Release funds
releaseBtn.addEventListener("click", async () => {
  if(!currentOrderID) return;
  try {
    const response = await fetch(`http://localhost:3000/api/release/${currentOrderID}`, {
      method: "POST"
    });
    const data = await response.json();
    if(data.success){
      messageDiv.style.display = "block";
      messageDiv.style.background = "#d4edda";
      messageDiv.style.color = "#155724";
      messageDiv.textContent = `✅ Funds released to seller for Order ID: ${currentOrderID}`;
      releaseBtn.style.display = "none";
      currentOrderID = null;
    } else {
      messageDiv.style.display = "block";
      messageDiv.style.background = "#ffe0e0";
      messageDiv.style.color = "#800000";
      messageDiv.textContent = `❌ Error: ${data.error}`;
    }
  } catch(err){
    console.error("❌ Release error:", err);
    messageDiv.style.display = "block";
    messageDiv.style.background = "#ffe0e0";
    messageDiv.style.color = "#800000";
    messageDiv.textContent = `❌ Network Error: ${err.message}`;
  }
});
