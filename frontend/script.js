const BASE_URL = "http://localhost:3000";

// ================= ALERT =================
function showAlert(msg){
  alert(msg);
}

// ================= NGO OPEN =================
function openNGO(name, desc, id){
  localStorage.setItem("ngoName", name);
  localStorage.setItem("ngoDesc", desc);
  localStorage.setItem("ngo_id", id);
  window.location.href = "ngo.html";
}

// ================= LOAD NGO =================
function loadNGO(){
  let name = localStorage.getItem("ngoName");
  let desc = localStorage.getItem("ngoDesc");

  if(document.getElementById("ngoName")){
    document.getElementById("ngoName").innerText = name || "NGO Name";
    document.getElementById("ngoDesc").innerText = desc || "NGO Description";
  }
}

// ================= SIGNUP =================
async function signup(){
  let email = document.getElementById("email")?.value.trim();
  let password = document.getElementById("password")?.value.trim();

  if(!email || !password){
    return showAlert("⚠️ Fill all fields!");
  }

  try{
    let res = await fetch(`${BASE_URL}/signup`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    });

    let data = await res.json();

    if(res.ok){
      showAlert("✅ Signup successful!");
      window.location.href = "login.html";
    }else{
      showAlert(data.message);
    }

  }catch(err){
    console.log(err);
    showAlert("❌ Server not reachable!");
  }
}

// ================= LOGIN =================
async function loginUser(){
  let email = document.getElementById("email")?.value.trim();
  let password = document.getElementById("password")?.value.trim();

  if(!email || !password){
    return showAlert("⚠️ Fill all fields!");
  }

  try{
    let res = await fetch(`${BASE_URL}/login`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    });

    let data = await res.json();

    if(res.ok){
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      showAlert("🔐 Login successful!");
      window.location.href="dashboard.html";
    }else{
      showAlert(data.message);
    }

  }catch(err){
    console.log(err);
    showAlert("❌ Server not reachable!");
  }
}

// ================= CHECK LOGIN =================
function checkLogin(){
  let user = localStorage.getItem("currentUser");
  if(!user){
    showAlert("⚠️ Please login first!");
    window.location.href = "login.html";
  }
}

// ================= DASHBOARD =================
async function loadDashboard(){
  checkLogin();

  let user = JSON.parse(localStorage.getItem("currentUser"));

  document.getElementById("userName").innerText = "Welcome, " + user.email;

  try{
    let res = await fetch(`${BASE_URL}/ngos`);
    let ngos = await res.json();

    document.getElementById("ngoCount").innerText = ngos.length;

  }catch{
    console.log("Dashboard error");
  }
}

// ================= LOGOUT =================
function logout(){
  localStorage.removeItem("currentUser");
  showAlert("👋 Logged out!");
  window.location.href = "index.html";
}

// ================= VOLUNTEER =================
async function registerVolunteer(){
  let user = JSON.parse(localStorage.getItem("currentUser"));

  let name = document.getElementById("name")?.value;
  let skill = document.getElementById("skill")?.value;
  let ngo_id = document.getElementById("ngo")?.value;

  if(!user){
    return showAlert("Login first!");
  }

  if(!name || !skill || !ngo_id){
    return showAlert("Fill all fields!");
  }

  try{
    let res = await fetch(`${BASE_URL}/volunteer`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        name,
        skill,
        ngo_id,
        email: user.email
      })
    });

    let data = await res.json();

    if(res.ok){
      showAlert("🎉 Volunteer Registered!");
    }else{
      showAlert(data.message);
    }

  }catch(err){
    console.log(err);
    showAlert("❌ Error registering volunteer");
  }
}

// ================= PAYMENT TOGGLE =================
function togglePayment(){
  let method = document.getElementById("paymentMethod").value;

  document.getElementById("cardBox").style.display = "none";
  document.getElementById("upiBox").style.display = "none";

  if(method === "card"){
    document.getElementById("cardBox").style.display = "block";
  }
  else if(method === "upi"){
    document.getElementById("upiBox").style.display = "block";
  }
}

// ================= DONATION =================
async function payNow(){
  console.log("🔥 Pay clicked");

  let user = JSON.parse(localStorage.getItem("currentUser"));
  let amount = document.getElementById("amount")?.value;
  let ngo_id = document.getElementById("ngo")?.value;
  let method = document.getElementById("paymentMethod")?.value;

  let box = document.getElementById("paymentBox");

  if(!user){
    return showAlert("Login first!");
  }

  if(!amount || amount <= 0){
    return showAlert("Enter valid amount!");
  }

  if(!method){
    return showAlert("Select payment method!");
  }

  box.innerHTML = "🔄 Processing Payment...";

  setTimeout(async ()=>{

    try{
      let res = await fetch(`${BASE_URL}/donate`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          email: user.email,
          ngo_id,
          amount
        })
      });

      let data = await res.json();

      if(res.ok){
        box.innerHTML = "✅ Payment Successful ❤️";
        showAlert("🎉 Donation Completed!");

        setTimeout(()=>{
          window.location.href="dashboard.html";
        },2000);

      }else{
        box.innerHTML = "❌ Failed";
        showAlert(data.message);
      }

    }catch(err){
      console.log(err);
      box.innerHTML = "❌ Server Error";
    }

  },2000);
}