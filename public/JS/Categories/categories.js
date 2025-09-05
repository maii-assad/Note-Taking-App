const categoriesList = document.getElementById("categoriesList");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const newCategoryName = document.getElementById("newCategoryName");

// هنا بتخزن التوكن بعد ما تعمل Login
const token = localStorage.getItem("token");

async function fetchCategories() {
  try {
    const response = await axios.get("/category", {
      headers: { Token: token },
    })

    categoriesList.innerHTML = "" // Clear list

    if (response.data.categories && response.data.categories.length > 0) {
      response.data.categories.forEach((cat) => {
        const li = document.createElement("li")
        li.textContent = cat.name

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"
        deleteBtn.onclick = () => deleteCategory(cat._id)

        li.appendChild(deleteBtn)
        categoriesList.appendChild(li);
      });
    } else {
      categoriesList.innerHTML = "<li>No categories found</li>";
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert("Failed to load categories");
  }
}

async function addCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    alert("Please enter a category name")
    return
  }

  try {
    await axios.post(
      "/category",
      { name },
      { headers: { Token: token } }
    );
    newCategoryName.value = "";
    fetchCategories(); // reload list
  } catch (error) {
    console.error("Error adding category:", error)
    alert("Failed to add category")
  }
}

async function deleteCategory(id) {
  try {
    await axios.delete(`/category/${id}`, {
      headers: { Token: token },
    })
    fetchCategories()
  } catch (error) {
    console.error("Error deleting category:", error)
    alert("Failed to delete category")
  }
}

addCategoryBtn.addEventListener("click", addCategory)
window.onload = fetchCategories
