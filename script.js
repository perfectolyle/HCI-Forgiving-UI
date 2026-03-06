document.addEventListener('DOMContentLoaded', () => {

    // --- View Navigation Objects ---
    const navPhase1 = document.getElementById('nav-phase1');
    const navPhase2 = document.getElementById('nav-phase2');
    const navTrash = document.getElementById('nav-trash');
    const viewPhase1 = document.getElementById('view-phase1');
    const viewPhase2 = document.getElementById('view-phase2');
    const viewTrash = document.getElementById('view-trash');
    const trashBadge = document.getElementById('trash-badge');
    const trashList = document.getElementById('trash-list');
    
    // Mobile Sidebar Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const leftSidebar = document.querySelector('.left-sidebar');

    // --- Create Post Elements (Phase 2 - Good Design) ---
    const postInput = document.getElementById('post-input');
    const createPostBtn = document.getElementById('create-post-btn');
    const postSubmitContainer = document.getElementById('post-submit-container');
    const postsContainer = document.getElementById('posts-container');
    const photoVideoBtn = document.getElementById('photo-video-btn');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');

    // --- Create Post Elements (Phase 1 - Bad Design) ---
    const postInputBad = document.getElementById('post-input-bad');
    const createPostBtnBad = document.getElementById('create-post-btn-bad');
    const postSubmitContainerBad = document.getElementById('post-submit-container-bad');
    const postsContainerBad = document.getElementById('posts-container-bad');
    const photoVideoBtnBad = document.getElementById('photo-video-btn-bad');
    const imageUploadBad = document.getElementById('image-upload-bad');
    const imagePreviewContainerBad = document.getElementById('image-preview-container-bad');
    const imagePreviewBad = document.getElementById('image-preview-bad');
    const removeImageBtnBad = document.getElementById('remove-image-btn-bad');
    
    // --- Modal Elements ---
    const deleteModal = document.getElementById('delete-modal');
    const closeModalIcon = document.getElementById('close-modal-icon');
    const confirmInput = document.getElementById('delete-confirm-input');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // --- Toast Element ---
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    // --- State Variables ---
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
    let currentImageSrcBad = null;

    // ==========================================
    // NAVIGATION LOGIC
    // ==========================================
    function resetNav() {
        navPhase1.style.backgroundColor = 'transparent';
        navPhase2.style.backgroundColor = 'transparent';
        navTrash.style.backgroundColor = 'transparent';
        
        navPhase1.classList.remove('active-nav');
        navPhase2.classList.remove('active-nav');
        
        viewPhase1.classList.add('hidden');
        viewPhase2.classList.add('hidden');
        viewTrash.classList.add('hidden');
        
        // Hide sidebar on mobile after clicking
        if (window.innerWidth <= 768) {
            leftSidebar.classList.remove('show');
        }
    }

    // Toggle menu button for mobile
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            leftSidebar.classList.toggle('show');
        });
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

    // ==========================================
    // IMAGE UPLOAD LOGIC (PHASE 2 - GOOD)
    // ==========================================
    photoVideoBtn.addEventListener('click', () => { imageUpload.click(); });

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

    // ==========================================
    // IMAGE UPLOAD LOGIC (PHASE 1 - BAD)
    // ==========================================
    photoVideoBtnBad.addEventListener('click', () => { imageUploadBad.click(); });

    imageUploadBad.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImageSrcBad = event.target.result;
                imagePreviewBad.src = currentImageSrcBad;
                imagePreviewContainerBad.classList.remove('hidden');
                postSubmitContainerBad.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtnBad.addEventListener('click', () => {
        currentImageSrcBad = null;
        imagePreviewBad.src = '';
        imagePreviewContainerBad.classList.add('hidden');
        imageUploadBad.value = '';
        if (postInputBad.value.trim() === '') {
            postSubmitContainerBad.classList.add('hidden');
        }
    });

    // ==========================================
    // CREATE POST LOGIC (PHASE 2 - GOOD)
    // ==========================================
    postInput.addEventListener('focus', () => {
        postSubmitContainer.classList.remove('hidden');
    });

    createPostBtn.addEventListener('click', () => {
        const text = postInput.value.trim();
        if (text || currentImageSrc) {
            const newPostId = 'post-' + Date.now();
            const newPost = { id: newPostId, text: text, date: 'Just now', image: currentImageSrc };
            posts.unshift(newPost); // Abstract data structure array
            
            const postHTML = createGoodPostElement(newPostId, text, currentImageSrc);
            postsContainer.insertAdjacentHTML('afterbegin', postHTML);
            
            const deleteBtn = document.querySelector(`.init-delete-btn[data-post-id="${newPostId}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => openDeleteModal(newPostId));
            }

            // Cleanup Mode
            postInput.value = '';
            currentImageSrc = null;
            imagePreview.src = '';
            imagePreviewContainer.classList.add('hidden');
            imageUpload.value = '';
            postSubmitContainer.classList.add('hidden');
            
            showToast('Post created successfully! You can gracefully test deleting it.', true);
        }
    });

    // ==========================================
    // CREATE POST LOGIC (PHASE 1 - BAD)
    // ==========================================
    postInputBad.addEventListener('focus', () => {
        postSubmitContainerBad.classList.remove('hidden');
    });

    createPostBtnBad.addEventListener('click', () => {
        const text = postInputBad.value.trim();
        if (text || currentImageSrcBad) {
            const newPostId = 'bad-post-' + Date.now();
            // Note: We don't push Phase 1 bad posts to the "posts" logic array because they are meant to be instantly destroyed without recovery.
            
            const postHTML = createBadPostElement(newPostId, text, currentImageSrcBad);
            postsContainerBad.insertAdjacentHTML('afterbegin', postHTML);
            
            // Cleanup Mode
            postInputBad.value = '';
            currentImageSrcBad = null;
            imagePreviewBad.src = '';
            imagePreviewContainerBad.classList.add('hidden');
            imageUploadBad.value = '';
            postSubmitContainerBad.classList.add('hidden');
            
            showToast('Post created successfully! Try deleting it to see what happens.', true);
        }
    });

    // --- Initial Event Listeners for existing good posts ---
    document.querySelectorAll('.init-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = e.currentTarget.getAttribute('data-post-id');
            openDeleteModal(postId);
        });
    });

    // ==========================================
    // MOCK INTERACTIONS
    // ==========================================
    window.mockSave = function() {
        showToast("Post Saved into your collection!", true);
    };
    window.mockEdit = function() {
        showToast("Error: Edit action is unavailable or broken in this design.", false);
    };
    window.editPost = function(postId) {
        const postElement = document.getElementById(postId);
        if (!postElement) return;

        const contentDiv = postElement.querySelector('.post-content');
        if (contentDiv.classList.contains('is-editing')) return;
        contentDiv.classList.add('is-editing');

        const postObj = posts.find(p => p.id === postId);
        // Fallback to textContent if post object isn't found
        const currentText = postObj ? postObj.text : contentDiv.textContent.trim();

        const inputArea = document.createElement('textarea');
        inputArea.className = 'edit-textarea';
        inputArea.value = currentText;
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-primary';
        saveBtn.textContent = 'Save Edit';
        saveBtn.style.marginTop = '8px';
        saveBtn.style.padding = '6px 12px';

        saveBtn.onclick = function() {
            const newText = inputArea.value.trim();
            if (postObj) postObj.text = newText;
            contentDiv.innerHTML = newText;
            contentDiv.classList.remove('is-editing');
            showToast("Post successfully updated!", true);
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-safe';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginTop = '8px';
        cancelBtn.style.marginLeft = '8px';
        cancelBtn.style.padding = '6px 12px';

        cancelBtn.onclick = function() {
            contentDiv.innerHTML = currentText;
            contentDiv.classList.remove('is-editing');
        };

        contentDiv.innerHTML = '';
        contentDiv.appendChild(inputArea);
        contentDiv.appendChild(saveBtn);
        contentDiv.appendChild(cancelBtn);
        inputArea.focus();
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
    window.mockBadDelete = function(element) {
        showToast("Oops! Direct delete clicked. Item instantly removed from database!");
        // Instantly destroy the DOM element representing the bad design delete constraint
        const postElement = element.closest('.post');
        if (postElement) postElement.remove();
    };

    // ==========================================
    // MODAL LOGIC (GOOD DESIGN RECOVERY)
    // ==========================================
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

        // Find and move to trash logic
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

    // ==========================================
    // TRASH CAN LOGIC
    // ==========================================
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
                    <p>When you delete a Phase 2 post, it will appear here so you can restore it if safely needed.</p>
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
            posts.push(restoredPost); 
            
            const postElement = document.getElementById(postId);
            if (postElement) {
                postElement.classList.remove('hidden');
            }

            renderTrashBadge();
            renderTrash();
            showToast("Post successfully restored to Dashboard.", true);
        }
    };

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

    // ==========================================
    // HTML GENERATORS
    // ==========================================
    function createGoodPostElement(id, text, imgSrc) {
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
                <div class="post-content">${text}</div>
                ${imageHtml}
                <div class="post-actions good-actions">
                    <div class="safe-actions">
                        <button class="btn-safe" onclick="window.editPost('${id}')"><ion-icon name="create"></ion-icon> Edit</button>
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

    function createBadPostElement(id, text, imgSrc) {
        let imageHtml = '';
        if (imgSrc) {
            imageHtml = `<div class="post-image"><img src="${imgSrc}" alt="Uploaded"></div>`;
        }

        return `
            <div class="post card bad-design-post" id="${id}">
                <div class="lab-tag bad">Phase 1: Bad Design (Error-Prone)</div>
                <div class="post-header">
                    <img src="https://ui-avatars.com/api/?name=User&background=E41E3F&color=fff" alt="Profile">
                    <div class="post-info">
                        <h4>User Name</h4>
                        <span>Just now · <ion-icon name="globe"></ion-icon></span>
                    </div>
                </div>
                <div class="post-content">${text}</div>
                ${imageHtml}
                <div class="post-actions bad-actions">
                    <button class="btn-bad" onclick="window.mockSave()"><ion-icon name="bookmark-outline"></ion-icon> Save</button>
                    <button class="btn-bad" onclick="window.mockEdit()"><ion-icon name="create-outline"></ion-icon> Edit</button>
                    <button class="btn-bad" onclick="window.mockBadDelete(this)"><ion-icon name="close-outline"></ion-icon> Delete</button>
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
