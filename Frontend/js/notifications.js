function showNotification(message, type = 'error') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} slide-up`;
    
    // Add icon based on type
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle mr-2"></i>' 
        : '<i class="fas fa-exclamation-circle mr-2"></i>';
    
    notification.innerHTML = `
        ${icon}
        <span class="font-medium">${message}</span>
        <div class="notification-progress"></div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
} 