document.addEventListener('DOMContentLoaded', () => {

    // View Navigation
    const navPhase1 = document.getElementById('nav-phase1');
    const navPhase2 = document.getElementById('nav-phase2');
    const navTrash = document.getElementById('nav-trash');
    const viewPhase1 = document.getElementById('view-phase1');
    const viewPhase2 = document.getElementById('view-phase2');
    const viewTrash = document.getElementById('view-trash');
    const trashBadge = document.getElementById('trash-badge');
    const trashList = document.getElementById('trash-list');

    // Create Post Elements
    const postInput = document.getElementById('post-input');
    const createPostBtn = document.getElementById('create-post-btn');
    const postSubmitContainer = document.getElementById('post-submit-container');
    const postsContainer = document.getElementById('posts-container');
    const photoVideoBtn = document.getElementById('photo-video-btn');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    
    // Modal
    const deleteModal = document.getElementById('delete-modal');
    const closeModalIcon = document.getElementById('close-modal-icon');
    const confirmInput = document.getElementById('delete-confirm-input');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    // State Variables
    let posts = [
        { 
            id: 'post-1', 
            text: 'Finally finished up my HCI assignment! Learning a lot about forgiving UI and user constraints. 🧠✨ Feel free to try adding and deleting a post!', 
            date: 'Just now',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60'
        }
    ];
    let trashedPosts = [];
    let postToDeleteId = null;
    let currentImageSrc = null;

    // --- Navigation Logic ---
    function resetNav() {
        navPhase1.style.backgroundColor = 'transparent';
        navPhase2.style.backgroundColor = 'transparent';
        navTrash.style.backgroundColor = 'transparent';
        
        // Remove style class to properly reset
        navPhase1.classList.remove('active-nav');
        navPhase2.classList.remove('active-nav');
        
        viewPhase1.classList.add('hidden');
        viewPhase2.classList.add('hidden');
        viewTrash.classList.add('hidden');
    }

    navPhase1.addEventListener('click', () => {
        resetNav();
        navPhase1.style.backgroundColor = 'var(--fb-hover)';
        viewPhase1.classList.remove('hidden');
    });

    navPhase2.addEventListener('click', () => {
        resetNav();
        navPhase2.style.backgroundColor = 'var(--fb-hover)';
        viewPhase2.classList.remove('hidden');
    });

    navTrash.addEventListener('click', () => {
        resetNav();
        navTrash.style.backgroundColor = 'var(--fb-hover)';
        viewTrash.classList.remove('hidden');
        renderTrash();
    });

    // --- Image Upload Logic ---
    photoVideoBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImageSrc = event.target.result;
                imagePreview.src = currentImageSrc;
                imagePreviewContainer.classList.remove('hidden');
                postSubmitContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', () => {
        currentImageSrc = null;
        imagePreview.src = '';
        imagePreviewContainer.classList.add('hidden');
        imageUpload.value = '';
        if (postInput.value.trim() === '') {
            postSubmitContainer.classList.add('hidden');
        }
    });

    // --- Create Post ---
    postInput.addEventListener('focus', () => {
        postSubmitContainer.classList.remove('hidden');
    });

    createPostBtn.addEventListener('click', () => {
        const text = postInput.value.trim();
        // A post should have either text or an image
        if (text || currentImageSrc) {
            const newPostId = 'post-' + Date.now();
            const newPost = { id: newPostId, text: text, date: 'Just now', image: currentImageSrc };
            posts.unshift(newPost); // Add to beginning
            
            // Create DOM element
            const postHTML = createPostElement(newPostId, text, currentImageSrc);
            postsContainer.insertAdjacentHTML('afterbegin', postHTML);
            
            // Attach delete listener to new button
            const deleteBtn = document.querySelector(`.init-delete-btn[data-post-id="${newPostId}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => openDeleteModal(newPostId));
            }

            postInput.value = '';
            
            // Revert state
            currentImageSrc = null;
            imagePreview.src = '';
            imagePreviewContainer.classList.add('hidden');
            imageUpload.value = '';
            postSubmitContainer.classList.add('hidden');
            
            showToast('Post created successfully! You can test deleting it.', true);
        }
    });

    // --- Initial Event Listeners for existing posts ---
    document.querySelectorAll('.init-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = e.currentTarget.getAttribute('data-post-id');
            openDeleteModal(postId);
        });
    });

    // --- Global Mocks for Feed Buttons ---
    window.mockSave = function() {
        showToast("Post Saved into your collection!", true);
    };
    window.mockEdit = function() {
        showToast("Edit mode triggered (Mock).", true);
    };
    window.mockLike = function() {
        showToast("You liked this post!", true);
    };
    window.mockComment = function() {
        showToast("Comment box opened (Mock).", true);
    };
    window.mockShare = function() {
        showToast("Share dialog opened (Mock).", true);
    };
    window.mockUnavailable = function(feature) {
        showToast(feature + " is disabled for this lab context.");
    };
    window.mockBadDelete = function() {
        showToast("Oops! Direct delete clicked. Item instantly removed!");
        const badPost = document.querySelector(".bad-design-post");
        if (badPost) badPost.style.display = "none";
    };

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
        showToast("Post moved to the Trash Can safely.");
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
                    <p>When you delete a post, it will appear here so you can restore it if safely needed.</p>
                </div>
            `;
            return;
        }

        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        let dateStr = futureDate.toLocaleDateString();

        let html = '';
        trashedPosts.forEach(post => {
            let label = post.text;
            if (!label && post.image) label = "[Image Post]";
            
            html += `
                <div class="trashed-post" id="trashed-${post.id}">
                    <div class="trashed-post-info">
                        <div class="trashed-post-text">"${label}"</div>
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
            showToast("Post successfully restored to Dashboard.", true);
        }
    };

    // --- Toast ---
    function showToast(message, isSuccess = false) {
        toastMsg.textContent = message;
        
        if (isSuccess) {
            toast.style.borderLeft = '4px solid #45BD62';
            document.querySelector('.toast-icon').style.color = '#45BD62';
        } else {
            toast.style.borderLeft = '4px solid #E41E3F';
            document.querySelector('.toast-icon').style.color = '#E41E3F';
        }
        
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    // --- Helper HTML Builder ---
    function createPostElement(id, text, imgSrc) {
        let imageHtml = '';
        if (imgSrc) {
            imageHtml = `<div class="post-image"><img src="${imgSrc}" alt="Uploaded"></div>`;
        }

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
                ${imageHtml}
                <div class="post-actions good-actions">
                    <div class="safe-actions">
                        <button class="btn-safe" onclick="window.mockEdit()"><ion-icon name="create"></ion-icon> Edit</button>
                        <button class="btn-safe" onclick="window.mockSave()"><ion-icon name="bookmark"></ion-icon> Save</button>
                    </div>
                    <div class="danger-actions">
                        <button class="btn-danger init-delete-btn" data-post-id="${id}"><ion-icon name="trash"></ion-icon> Delete</button>
                    </div>
                </div>
                <div class="post-footer">
                    <div class="footer-btn" onclick="window.mockLike()"><ion-icon name="thumbs-up-outline"></ion-icon> Like</div>
                    <div class="footer-btn" onclick="window.mockComment()"><ion-icon name="chatbubble-outline"></ion-icon> Comment</div>
                    <div class="footer-btn" onclick="window.mockShare()"><ion-icon name="arrow-redo-outline"></ion-icon> Share</div>
                </div>
            </div>
        `;
    }

});
