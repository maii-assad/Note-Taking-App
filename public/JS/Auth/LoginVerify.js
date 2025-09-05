const form = document.getElementById('verify-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await axios.post('/auth/login/verify', data);
    const result = response.data;

    if (result.error) {
      alert(result.error);
    } else {
      alert('Login verified successfully!');
      window.location.href = '/home';
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong during verification!");
  }
});
