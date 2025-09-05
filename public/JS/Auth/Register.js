const form = document.getElementById('registerform');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post('/auth/register', data);
    const result = response.data;

    if (result.error) {
      alert(result.error);
    } else {
      alert('Registration successful!');
      form.reset();
      window.location.href = '/auth/login/start'; // بعد التسجيل يروح Login page
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong during registration!");
  }
});
