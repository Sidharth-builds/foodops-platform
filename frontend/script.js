import { signup, login } from "../integrations/auth.js";


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

function showLogin(){ choiceBox.style.display="none"; loginBox.style.display="block"; }
function showSignup(){ choiceBox.style.display="none"; signupBox.style.display="block"; }

async function doSignup(){
  try {
    await signup(signupEmail.value, signupPass.value);
    localStorage.setItem("isLoggedIn","true");
    localStorage.setItem("role", signupRole.value);
    goHome();
  } catch (err) {
    alert(err.message);
  }
}


async function doLogin(){
  try {
    await login(loginEmail.value, loginPass.value);
    localStorage.setItem("isLoggedIn","true");
    localStorage.setItem("role", localStorage.getItem("selectedRole"));
    goHome();
  } catch (err) {
    alert("Invalid login credentials");
  }
}


function doLogout(){
  localStorage.clear();
  window.location.href="login.html";
}

window.showLogin = showLogin;
window.showSignup = showSignup;
window.doLogin = doLogin;
window.doSignup = doSignup;
window.doLogout = doLogout;