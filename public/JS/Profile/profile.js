async function loadProfile() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not authenticated. Please login.");
            return;
        }

        const res = await fetch("/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to load profile");
            return;
        }


        document.getElementById("username").textContent = data.username;

        document.getElementById("email").textContent = data.email;
        document.getElementById("fname").textContent = data.firstName || "Not set";
        document.getElementById("lname").textContent = data.lastName || "Not set";
        document.getElementById("otpCheckbox").checked = !!data.otpEnabled;
    } catch (err) {
        console.error(err);
        alert("Error loading profile");
    }
}


document.getElementById("otpCheckbox").addEventListener("change", async (e) => {
    const token = localStorage.getItem("token");
    const newValue = e.target.checked;

    const res = await fetch("/profile/enable-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": token },
        body: JSON.stringify({ otpEnabled: newValue })
    });
});


document.getElementById("changePasswordForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch("/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Password updated!");
    if (res.ok) location.reload();
});

document.getElementById("changeNameForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch("/profile/change-first-last-name", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Name updated!");
    if (res.ok) location.reload();
});


loadProfile();