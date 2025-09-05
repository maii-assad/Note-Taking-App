const form = document.getElementById('login-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    try {
        const response = await axios.post('/auth/login/start', data);
        console.log(response);
        const result = response.data;
        if (result.error) {
            alert(result.error);
        } else {
            alert('login start successful');
            form.reset();
        }
    } catch (error) {
        console.log(error)
    }
})