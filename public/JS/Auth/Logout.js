const form = document.getElementById('logoutform');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await axios.delete('/auth/logout');
        const result = response.data;

        if (result.error) {
            alert(result.error);
        } else {
            alert('Logged out successfully');
            // بعد اللوج أوت يرجعه login
            window.location.href = '/auth/login/start';
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong during logout!");
    }
});
