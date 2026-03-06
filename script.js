document.addEventListener('DOMContentLoaded', () => {

    // View Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navTrash = document.getElementById('nav-trash');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewTrash = document.getElementById('view-trash');
    const trashBadge = document.getElementById('trash-badge');
    const trashList = document.getElementById('trash-list');

    // Create Post
    const postInput = document.getElementById('post-input');
    const createPostBtn = document.getElementById('create-post-btn');
    const postSubmitContainer = document.getElementById('post-submit-container');
    const postsContainer = document.getElementById('posts-container');
    
    // Modal
    const deleteModal = document.getElementById('delete-modal');
    const closeModalIcon = document.getElementById('close-modal-icon');
    const confirmInput = document.getElementById('delete-confirm-input');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    // State
    let posts = [
        { id: 'post-1', text: 'Finally finished up my HCI assignment! Learning a lot about forgiving UI and user constraints. 🧠✨ Feel free to try adding and deleting a post!', date: 'Just now' }
    ];
    let trashedPosts = [];
    let postToDeleteId = null;

    // --- Navigation ---
    navDashboard.addEventListener('click', () => {
        navDashboard.style.backgroundColor = 'var(--fb-hover)';
        navTrash.style.backgroundColor = 'transparent';
        viewDashboard.classList.remove('hidden');
        viewTrash.classList.add('hidden');
    });

    navTrash.addEventListener('click', () => {
        navTrash.style.backgroundColor = 'var(--fb-hover)';
        navDashboard.style.backgroundColor = 'transparent';
        viewDashboard.classList.add('hidden');
        viewTrash.classList.remove('hidden');
        renderTrash();
    });

    // --- Create Post ---
    postInput.addEventListener('focus', () => {
        postSubmitContainer.classList.remove('hidden');
    });

    createPostBtn.addEventListener('click', () => {
        const text = postInput.value.trim();
        if (text) {
            const newPostId = 'post-' + Date.now();
            const newPost = { id: newPostId, text: text, date: 'Just now' };
            posts.unshift(newPost); // Add to beginning
            
            // Create DOM element
            const postHTML = createPostElement(newPostId, text);
            postsContainer.insertAdjacentHTML('afterbegin', postHTML);
            
            // Attach delete listener to new button
            const deleteBtn = document.querySelector(`.init-delete-btn[data-post-id="${newPostId}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => openDeleteModal(newPostId));
            }

            postInput.value = '';
            postSubmitContainer.classList.add('hidden');
            showToast('Post created successfully! You can test deleting it.');
        }
    });

    // --- Initial Event Listeners for existing posts ---
    document.querySelectorAll('.init-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = e.currentTarget.getAttribute('data-post-id');
            openDeleteModal(postId);
        });
    });

    // --- Modal Logic ---
    function openDeleteModal(postId) {
        postToDeleteId = postId;
        deleteModal.classList.remove('hidden');
        confirmInput.value = '';
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.classList.add('disabled');
        confirmInput.focus();
    }

    function closeModal() {
        deleteModal.classList.add('hidden');
        postToDeleteId = null;
    }

    closeModalIcon.addEventListener('click', closeModal);
    cancelDeleteBtn.addEventListener('click', closeModal);

    confirmInput.addEventListener('input', (e) => {
        if (e.target.value === 'DELETE') {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.classList.remove('disabled');
        } else {
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.classList.add('disabled');
        }
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (confirmInput.value !== 'DELETE' || !postToDeleteId) return;

        // Find and move to trash
        const postIndex = posts.findIndex(p => p.id === postToDeleteId);
        if (postIndex > -1) {
            trashedPosts.push(posts[postIndex]);
            posts.splice(postIndex, 1);
        }

        // Hide from feed
        const postElement = document.getElementById(postToDeleteId);
        if (postElement) {
            postElement.classList.add('hidden');
        }

        renderTrashBadge();
        closeModal();
        showToast("Post moved to Trash Can.");
    });

    // --- Trash Logic ---
    function renderTrashBadge() {
        if (trashedPosts.length > 0) {
            trashBadge.textContent = trashedPosts.length;
            trashBadge.classList.remove('hidden');
        } else {
            trashBadge.classList.add('hidden');
        }
    }

    function renderTrash() {
        if (trashedPosts.length === 0) {
            trashList.innerHTML = `
                <div class="card empty-state">
                    <ion-icon name="trash-outline"></ion-icon>
                    <h3>No recently deleted posts</h3>
                    <p>When you delete a post, it will appear here so you can restore it if needed.</p>
                </div>
            `;
            return;
        }

        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        let dateStr = futureDate.toLocaleDateString();

        let html = '';
        trashedPosts.forEach(post => {
            html += `
                <div class="trashed-post" id="trashed-${post.id}">
                    <div class="trashed-post-info">
                        <div class="trashed-post-text">"${post.text}"</div>
                        <div class="trashed-post-date"><ion-icon name="time-outline"></ion-icon> Permanently deletes on ${dateStr}</div>
                    </div>
                    <button class="btn-restore" onclick="window.restorePost('${post.id}')">Restore</button>
                </div>
            `;
        });
        trashList.innerHTML = html;
    }

    window.restorePost = function(postId) {
        const index = trashedPosts.findIndex(p => p.id === postId);
        if (index > -1) {
            const restoredPost = trashedPosts.splice(index, 1)[0];
            posts.push(restoredPost); // Put back to logic array
            
            // Un-hide in feed
            const postElement = document.getElementById(postId);
            if (postElement) {
                postElement.classList.remove('hidden');
            }

            renderTrashBadge();
            renderTrash();
            showToast("Post successfully restored to Dashboard.");
        }
    };

    // --- Toast ---
    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    // --- Helper HTML Builder ---
    function createPostElement(id, text) {
        return `
            <div class="post card good-design-post" id="${id}">
                <div class="lab-tag good">Phase 2: Forgiving Redesign</div>
                <div class="post-header">
                    <img src="https://ui-avatars.com/api/?name=User&background=1877F2&color=fff" alt="Profile">
                    <div class="post-info">
                        <h4>User Name</h4>
                        <span>Just now · <ion-icon name="globe"></ion-icon></span>
                    </div>
                </div>
                <div class="post-content">
                    ${text}
                </div>
                <div class="post-actions good-actions">
                    <div class="safe-actions">
                        <button class="btn-safe"><ion-icon name="create"></ion-icon> Edit</button>
                        <button class="btn-safe"><ion-icon name="bookmark"></ion-icon> Save</button>
                    </div>
                    <div class="danger-actions">
                        <button class="btn-danger init-delete-btn" data-post-id="${id}"><ion-icon name="trash"></ion-icon> Delete</button>
                    </div>
                </div>
                <div class="post-footer">
                    <div class="footer-btn"><ion-icon name="thumbs-up-outline"></ion-icon> Like</div>
                    <div class="footer-btn"><ion-icon name="chatbubble-outline"></ion-icon> Comment</div>
                    <div class="footer-btn"><ion-icon name="arrow-redo-outline"></ion-icon> Share</div>
                </div>
            </div>
        `;
    }

});
