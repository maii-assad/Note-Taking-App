const form = document.getElementById('resetForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const newPassword = data.newPassword;
    const confirmPassword = data.confirmPassword;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Get reset token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        alert("Reset token is missing. Please use the link sent to your email");
        return;
    }

    try {
        // Send reset password request to backend
        const response = await axios.post('/auth/reset-password', { newPassword, confirmPassword },
            { headers: { "Authorization": `Bearer ${token}` }}
        )

        const result = response.data;

        if (result.error) {
            alert(result.error);
        } else {
            alert("Password reset successful!");
            form.reset();
            window.location.href = "/auth/login/start"; // Redirect to login page
        }
    } catch (error) {
        console.error("ResetPassword Error:", error);
        alert("Server error while resetting password");
    }
});
