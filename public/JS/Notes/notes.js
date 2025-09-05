const notesList = document.getElementById("notesList");
const addNoteModal = document.getElementById("addNoteModal");
const editNoteModal = document.getElementById("editNoteModal");

let selectedNote = null;

// Modal Handlers
document.getElementById("openAddModal").onclick = () => addNoteModal.style.display = "flex";
document.getElementById("closeAddModal").onclick = () => addNoteModal.style.display = "none";
document.getElementById("closeEditModal").onclick = () => editNoteModal.style.display = "none";

// Fetch Notes
async function fetchNotes() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("/notes", {
            method: "GET",
            headers: { "Content-Type": "application/json", "token": token }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        renderNotes(data.notes);
    } catch (err) {
        console.error("Error fetching notes:", err.message);
    }
}

// Render Notes
function renderNotes(notes) {
    notesList.innerHTML = "";
    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
      <div class="note-content">
        <h3>${note.title}</h3>
        <p>${note.categoryName}</p>
      </div>
      <div class="note-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

        li.querySelector(".delete").onclick = async () => {
            try {
                const res = await fetch(`/notes/${note._id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") }
                });
                if (!res.ok) throw new Error(await res.text());
                fetchNotes();
            } catch (err) {
                alert("Error deleting note: " + err.message);
            }
        };

        li.querySelector(".edit").onclick = () => openEditModal(note);
        notesList.appendChild(li);
    });
}

// Add Note
document.getElementById("addNoteBtn").onclick = async () => {
    const title = document.getElementById("noteTitle").value;
    const categoryName = document.getElementById("categoryName").value;
    const content = document.getElementById("noteContent").value;

    if (!title || !content) return alert("Title and Content required!");

    try {
        await fetch("/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
            body: JSON.stringify({ title, categoryName, content })
        });

        fetchNotes();
        addNoteModal.style.display = "none";
        document.getElementById("noteTitle").value = "";
        document.getElementById("categoryName").value = "";
        document.getElementById("noteContent").value = "";
    } catch (err) {
        console.error("Error adding note:", err);
    }
};

// Open Edit Modal
function openEditModal(note) {
    selectedNote = note;
    document.getElementById("editNoteTitle").value = note.title;
    document.getElementById("editCategoryName").value = note.categoryName;
    document.getElementById("editNoteContent").value = note.content;
    editNoteModal.style.display = "flex";
}

// Save Edit
document.getElementById("saveEditBtn").onclick = async () => {
    if (!selectedNote) return;
    try {
        await fetch(`/notes/${selectedNote._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
            body: JSON.stringify({
                title: document.getElementById("editNoteTitle").value,
                content: document.getElementById("editNoteContent").value,
                categoryName: document.getElementById("editCategoryName").value
            })
        });
        fetchNotes();
        editNoteModal.style.display = "none";
    } catch (err) {
        console.error("Error updating note:", err);
    }
};

// Initial Load
fetchNotes();
