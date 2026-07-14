// ---- Login page logic ----
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error-msg").style.display = "block";
    }
  });
}

// ---- Logout (shared across dashboard/builder/workflow pages) ----
const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    window.location.href = "index.html";
  });
}

// ---- Route protection + sidebar user tag (call on every protected page) ----
function requireLogin() {
  let user = getCurrentUser();
  if (user === null) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("user-tag").textContent = "Signed in as " + user.username + " (" + user.role + ")";

  let builderLink = document.getElementById("nav-builder");
  if (builderLink && user.role !== "admin" && user.role !== "manager") {
    builderLink.style.display = "none";
  }
}
