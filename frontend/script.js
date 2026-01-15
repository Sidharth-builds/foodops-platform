function goLogin(role){
  localStorage.setItem("selectedRole", role);
  window.location.href = "login.html";
}

function goHome(){
  if(localStorage.getItem("isLoggedIn") === "true"){
    let role = localStorage.getItem("role");
    window.location.href = role === "provider" ? "provider.html" : "ngo.html";
  } else {
    window.location.href = "index.html";
  }
}

function showLogin(){
  document.getElementById("choiceBox").style.display="none";
  document.getElementById("loginBox").style.display="block";
}

function showSignup(){
  document.getElementById("choiceBox").style.display="none";
  document.getElementById("signupBox").style.display="block";
  
  // Auto-select role if passed from previous page
  let selectedRole = localStorage.getItem("selectedRole");
  if(selectedRole){
    document.getElementById("signupRole").value = selectedRole;
    // Clear it so it doesn't persist forever
    localStorage.removeItem("selectedRole");
  }
}

function doSignup(){
  let email = document.getElementById("signupEmail").value;
  let pass = document.getElementById("signupPass").value;
  let role = document.getElementById("signupRole").value;

  if(!email || !pass || !role) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")||"[]");
  if(users.some(u => u.email === email)) {
    alert("Email already registered");
    return;
  }

  users.push({email, pass, role});
  localStorage.setItem("users", JSON.stringify(users));
  
  // Auto login
  localStorage.setItem("isLoggedIn","true");
  localStorage.setItem("role", role);
  goHome();
}

function doLogin(){
  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;

  if(!email || !pass) {
    alert("Please enter email and password");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")||"[]");
  let user = users.find(u=>u.email===email && u.pass===pass);
  
  if(!user) return alert("Invalid email or password");
  
  localStorage.setItem("isLoggedIn","true");
  localStorage.setItem("role", user.role);
  goHome();
}

function logout(){
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  window.location.href="index.html";
}
