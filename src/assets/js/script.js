document.addEventListener('DOMContentLoaded', function() {
    const termsContainer = document.querySelector('.school-terms-container');
    
    // Handle add term button click
    document.querySelector('.add-term').addEventListener('click', function() {
        const newTermGroup = document.createElement('div');
        newTermGroup.className = 'form-group term-group mt-2';
        newTermGroup.innerHTML = `
            <div class="d-flex align-items-center">
                <select class="form-control mr-2">
                    <option selected disabled>School Terms</option>
                    <!-- Add options -->
                </select>
                <button type="button" class="btn btn-primary remove-term">-</button>
            </div>
        `;
        
        termsContainer.appendChild(newTermGroup);
        
        // Add event listener to the new remove button
        newTermGroup.querySelector('.remove-term').addEventListener('click', function() {
            newTermGroup.remove();
        });
    });
    
    // Handle file upload preview
    const fileInput = document.getElementById('schoolLogo');
    const uploadArea = document.querySelector('.upload-area');
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                uploadArea.innerHTML = `
                    <img src="${e.target.result}" alt="School Logo" style="max-width: 100%; max-height: 150px;">
                    <small>Click to change image</small>
                `;
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Handle action menu clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('action-menu-trigger')) {
            // Close any other open menus
            document.querySelectorAll('.action-menu-popup.show').forEach(popup => {
                if (popup !== e.target.nextElementSibling) {
                    popup.classList.remove('show');
                }
            });
            
            // Toggle the clicked menu
            const popup = e.target.nextElementSibling;
            popup.classList.toggle('show');
        } else if (!e.target.closest('.action-menu-popup')) {
            // Close all menus when clicking outside
            document.querySelectorAll('.action-menu-popup.show').forEach(popup => {
                popup.classList.remove('show');
            });
        }
    });
});
