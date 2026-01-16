/* =====================================================
   CONFIG
===================================================== */
const API_BASE = "http://localhost:5000";

/* =====================================================
   NAVIGATION
===================================================== */
window.goHome = function () {
  window.location.href = "index.html";
};

window.goLogin = function (role) {
  localStorage.setItem("loginRole", role);
  window.location.href = "login.html";
};

/* =====================================================
   LOGOUT (FIXED + BACKWARD COMPATIBLE)
===================================================== */
window.doLogout = function () {
  localStorage.clear();
  window.location.href = "login.html";
};

// Alias so old HTML onclick="logout()" still works
window.logout = function () {
  doLogout();
};

/* =====================================================
   LOGIN / SIGNUP UI TOGGLE
===================================================== */
window.showLogin = function () {
  document.getElementById("choiceBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
};

window.showSignup = function () {
  document.getElementById("choiceBox").style.display = "none";
  document.getElementById("signupBox").style.display = "block";
};

/* =====================================================
   LOGIN
===================================================== */
window.doLogin = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;

  if (!email || !password) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "provider") {
      window.location.href = "provider.html";
    } else {
      window.location.href = "ngo.html";
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};

/* =====================================================
   SIGNUP
===================================================== */
window.doSignup = async function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPass").value;
  const role = document.getElementById("signupRole").value;

  if (!email || !password || !role) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Signup successful. Please login.");
    location.reload();

  } catch (err) {
    console.error(err);
    alert("Signup failed");
  }
};

/* =====================================================
   PROVIDER DASHBOARD — POST FOOD
===================================================== */
window.postFood = async function () {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "provider") {
    window.location.href = "login.html";
    return;
  }

  const title = document.getElementById("foodTitle").value;
  const quantity = document.getElementById("foodQty").value;
  const location = document.getElementById("foodLoc").value;

  if (!title || !quantity || !location) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, quantity, location })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Food posted successfully");

    document.getElementById("foodTitle").value = "";
    document.getElementById("foodQty").value = "";
    document.getElementById("foodLoc").value = "";

    loadMyFood();

  } catch (err) {
    console.error(err);
    alert("Error posting food");
  }
};

/* =====================================================
   PROVIDER DASHBOARD — LOAD FOOD
===================================================== */
async function loadMyFood() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const list = document.getElementById("foodList");
  if (!list) return;

  try {
    const res = await fetch(`${API_BASE}/api/food/mine`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const foods = await res.json();
    list.innerHTML = "";

    if (foods.length === 0) {
      list.innerHTML = "<p>No food posted yet.</p>";
      return;
    }

    foods.forEach(food => {
      const div = document.createElement("div");
      div.className = "food-card";
      div.innerHTML = `
        <h4>${food.title}</h4>
        <p><strong>Qty:</strong> ${food.quantity}</p>
        <p><strong>Location:</strong> ${food.location}</p>
        <p><strong>Status:</strong> ${food.status}</p>
      `;
      list.appendChild(div);
    });

  } catch (err) {
    console.error(err);
  }
}

/* Auto-load provider food when on provider page */
if (document.getElementById("foodList")) {
  loadMyFood();
}
