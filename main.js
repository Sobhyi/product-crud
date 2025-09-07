let product_name = document.querySelector(".name");
let product_type = document.querySelector(".type");
let all_inputs = document.querySelectorAll(".all_inputs");
let product_result = document.querySelector(".product_result");
let add = document.querySelector(".add");
let remove = document.querySelector(".remove");
let list = document.querySelector(".list");
let table_body = document.querySelector(".table_body");
let product_view = document.querySelector(".product_view");
let quantityInput = document.querySelector(".quantity");
let quantityParagraph = document.querySelector(".quantityP");

let data;
let globalId;
let mode = "create";
let mode2 = "remove";
let tax_cost = 0;
let sale_cost = 0;
let net_profit = 0;
let discount_cost = 0;

// check if there is data in local storage or its empty
if (localStorage.myproduct == null) {
  data = []; //make it empty array
} else {
  data = JSON.parse(localStorage.getItem("myproduct")); //get the data from local storage and put it in the array
}

// update the calculation result function
let update_result = () => {
  product_result.innerHTML = `<p>sale cost : ${Math.round(sale_cost)}$</p>
        <p>Net profit : ${Math.round(net_profit)}$</p>
        <p>discount cost : ${Math.round(discount_cost)}$</p> 
        <p>tax cost : ${Math.round(tax_cost)}$</p>
        `;
};

// calculate the inputs value
let calc = () => {
  // اقرأ القيم مباشرة من ال inputs
  let cost = +all_inputs[0].value || 0;
  let profit = +all_inputs[1].value || 0;
  let discount = +all_inputs[2].value || 0;
  let tax = +all_inputs[3].value || 0;

  let all_costs = cost + profit + tax;

  // احسب الخصم والضريبة الأول
  discount_cost = (all_costs * discount) / 100;
  tax_cost = (all_costs * tax) / 100;

  // بعدين احسب الباقي
  sale_cost = all_costs - discount_cost;
  net_profit = profit - discount_cost;

  update_result();
};

// show data in the table
let showdata = () => {
  let table_row = "";
  for (let i = 0; i < data.length; i++) {
    table_row += ` <tr>
                          <td>${i + 1}</td> 
                          <td>${data[i].name}</td>
                          <td>${data[i].type}</td> 
                          <td><i onclick="view(${i})" class="fa-solid fa-eye list_i" style="color: #228896;"></i></td> 
                          <td><i onclick="edit_product(${i})" class="fa-solid fa-pen-to-square list_i" style="color: #FFD43B;"></i></td> 
                          <td><i onclick="delete_icon(${i})" class="fa-solid fa-trash-can list_i" style="color: #ff0000;"></i></td>
                       </tr>`;
  }
  table_body.innerHTML = table_row;
};

// reset the all inputs value after adding or updating the product  
let resetForm = () => {
  product_name.value = "";
  product_type.value = "";
  for (let i = 0; i < all_inputs.length; i++) {
    all_inputs[i].value = "";
  }
  product_result.innerHTML = `<p>sale cost : 0$</p>
                <p>Net profit : 0$</p>
                <p>discount cost : 0$</p> 
                <p>tax cost : 0$</p>
                `;
};

// edit one product by its icon index
let edit_product = (i) => {
  globalId = i;
  mode = "update";
  mode2 = "cancel";
  product_name.value = data[i].name;
  product_type.value = data[i].type;
  all_inputs[0].value = data[i].cost;
  all_inputs[1].value = data[i].profit;
  all_inputs[2].value = data[i].discount;
  all_inputs[3].value = data[i].tax;
  all_inputs[4].value = data[i].quantity;
  all_inputs[5].value = data[i].image;
  calc();

  add.classList.replace("add", "edit");
  remove.classList.replace("remove", "cancel");
  add.innerHTML = "update";
  remove.innerHTML = "cancel";
  quantityInput.classList.add("none");
  quantityParagraph.classList.add("none");
};

// add product function or update product function
let add_product = () => {
  let product = { //product object
    name: product_name.value,
    type: product_type.value,
    cost: all_inputs[0].value,
    profit: all_inputs[1].value,
    discount: all_inputs[2].value,
    tax: all_inputs[3].value,
    quantity: all_inputs[4].value,
    image: all_inputs[5].value,
    sale_cost: sale_cost,
    net_profit: net_profit,
    discount_cost: discount_cost,
    tax_cost: tax_cost,
  };
  if (mode == "create") {
    for (let i = 0; i < parseInt(quantityInput.value || "1"); i++) {
      data.push(product);
    }
  } else {
    data[globalId] = product;
    add.classList.replace("edit", "add");
    remove.classList.replace("cancel", "remove");
    quantityInput.classList.remove("none");
    quantityParagraph.classList.remove("none");
    add.innerHTML = "add product";
    remove.innerHTML = "remove all";
    mode = "create";
  }
  localStorage.setItem("myproduct", JSON.stringify(data));//update the local storage after adding or updating the product

  showdata();
  resetForm();
};

// remove all products or cancel the edit mode
let removeAll = () => {
  if (mode2 == "remove") {
    data.splice(0);
    localStorage.removeItem("myproduct");
    showdata();
  } else {
    resetForm();
    add.classList.replace("edit", "add");
    remove.classList.replace("cancel", "remove");
    add.innerHTML = "add product";
    remove.innerHTML = "remove all";
    mode2 = "remove";
  }
};

// close the view function by the icon
let close_icon = () => {
  product_view.style.display = "none";
};

// view the product info by its index icon
let view = (i) => {
  product_view.innerHTML = ` <h2>Product Information <i class="fa-solid fa-xmark close-icon" onclick="close_icon()"></i> </h2>
        <img src="${data[i].image}" alt="Product Image">
        
        <div class="product_info">
            <p><span>Name:</span> <span class="info">${data[i].name}</span></p>
            <p><span>Type:</span> <span class="info">${data[i].type}</span></p>
            <p><span>Cost:</span> <span class="info">${data[i].cost}</span></p>
            <p><span>Profit:</span> <span class="info">${data[i].profit}</span></p>
            <p><span>Discount:</span> <span class="info">${data[i].discount}</span></p>
            <p><span>Tax:</span> <span class="info">${data[i].tax}</span></p>
            <p><span>Quantity:</span> <span class="info">${data[i].quantity}</span></p>
            <p><span>Sale Cost:</span> <span class="info">${data[i].sale_cost}</span></p>
            <p><span>Net Profit:</span> <span class="info">${data[i].net_profit}</span></p>
            <p><span>Discount Cost:</span> <span class="info">${data[i].discount_cost}</span></p>
            <p><span>Tax Cost:</span> <span class="info">${data[i].tax_cost}</span></p>
        </div>`;
  product_view.style.display = "block";
};

// delete one product by its index icon
let delete_icon = (i) => {
  data.splice(i, 1);
  localStorage.myproduct = JSON.stringify(data);//update the local storage after deleting the product
  showdata();
};

showdata();//to update the table data 

// event listeners
add.addEventListener("click", add_product);
remove.addEventListener("click", removeAll);
for (let i = 0; i < all_inputs.length; i++) {
  all_inputs[i].addEventListener("keyup", calc);
}
