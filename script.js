document.addEventListener("DOMContentLoaded", () => {
  // Nodes
  const navDashboard = document.getElementById("nav-dashboard");
  const navTrash = document.getElementById("nav-trash");
  const viewDashboard = document.getElementById("view-dashboard");
  const viewTrash = document.getElementById("view-trash");

  const badButtons = document.querySelectorAll(".btn-bad");

  // Good Design nodes
  const initDeleteBtn = document.getElementById("init-delete-btn");
  const goodPostContainer = document.getElementById("good-post-container");
  const postDeletedMsg = document.getElementById("post-deleted-msg");

  // Modal Nodes
  const deleteModal = document.getElementById("delete-modal");
  const confirmInput = document.getElementById("delete-confirm-input");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

  // Trash Nodes
  const trashList = document.getElementById("trash-list");
  const trashBadge = document.getElementById("trash-badge");

  // Toast
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  // State
  let isDeleted = false;
  let postData = {
    title: "Important Project Update",
    content: "Here are the latest statistics for our quarterly goals.",
  };

  // View Navigation
  navDashboard.addEventListener("click", () => {
    navDashboard.classList.add("active");
    navTrash.classList.remove("active");
    viewDashboard.classList.remove("hidden");
    viewTrash.classList.add("hidden");
  });

  navTrash.addEventListener("click", () => {
    navTrash.classList.add("active");
    navDashboard.classList.remove("active");
    viewTrash.classList.remove("hidden");
    viewDashboard.classList.add("hidden");
  });

  // Phase 1: Bad Design Interaction
  badButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("action-fail")) {
        showToast("Oops! You slipped and clicked 'Delete' by accident.", true);
      } else {
        showToast("Action triggered safely.");
      }
    });
  });

  // Phase 4: Open Modal (Friction)
  initDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("hidden");
    confirmInput.value = "";
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.classList.add("disabled");
    confirmInput.focus();
  });

  // Close Modal
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });

  // Phase 4: Constraint Validation Let the user type 'DELETE'
  confirmInput.addEventListener("input", (e) => {
    if (e.target.value === "DELETE") {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.classList.remove("disabled");
    } else {
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.classList.add("disabled");
    }
  });

  // Confirm Delete Action
  confirmDeleteBtn.addEventListener("click", () => {
    if (confirmInput.value !== "DELETE") return;

    // Hide Modal
    deleteModal.classList.add("hidden");

    // Update Dashboard View
    goodPostContainer.classList.add("hidden");
    postDeletedMsg.classList.remove("hidden");
    isDeleted = true;

    // Add to Trash Can
    updateTrashView();

    showToast("Post safely moved to Trash Can.");
  });

  // Toast Functionality
  function showToast(message, isError = false) {
    toastMsg.textContent = message;
    toast.style.borderColor = isError ? "var(--danger)" : "var(--border)";
    toast.querySelector("ion-icon").style.color = isError
      ? "var(--danger)"
      : "var(--accent)";

    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }

  // Update Trash View Structure
  function updateTrashView() {
    if (isDeleted) {
      trashBadge.textContent = "1";
      trashBadge.classList.remove("hidden");

      // Calculate 30 days from now
      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      let dateStr = futureDate.toLocaleDateString();

      trashList.innerHTML = `
                <div class="trash-item" id="trashed-post">
                    <div class="trash-info">
                        <h3>${postData.title}</h3>
                        <div class="trash-expiry">
                            <ion-icon name="time"></ion-icon> Permanently deletes on ${dateStr}
                        </div>
                    </div>
                    <div class="trash-actions">
                        <button class="btn-success" id="restore-btn"><ion-icon name="refresh"></ion-icon> Restore</button>
                    </div>
                </div>
            `;

      // Attach Restore Listener
      document.getElementById("restore-btn").addEventListener("click", () => {
        restorePost();
      });
    } else {
      trashBadge.classList.add("hidden");
      trashList.innerHTML = `
                <div class="empty-state">
                    <ion-icon name="folder-open"></ion-icon>
                    <h3>Trash is empty</h3>
                    <p>No recently deleted posts found.</p>
                </div>
            `;
    }
  }

  // Phase 3: Restore (Reversibility)
  function restorePost() {
    isDeleted = false;

    // Update Dashboard View
    postDeletedMsg.classList.add("hidden");
    goodPostContainer.classList.remove("hidden");

    // Update Trash View
    updateTrashView();

    showToast("Post successfully restored!");
  }
});
