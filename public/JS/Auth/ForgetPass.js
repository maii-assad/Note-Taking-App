const form = document.getElementById('forgetform');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await axios.post('/auth/forget-password', data);
    const result = response.data;

    if (result.error) {
      alert(result.error);
    } else {
      alert('Password reset link sent to your email!');
      form.reset();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong while sending reset link!");
  }
});
