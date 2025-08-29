// Variable para almacenar los anuncios, se inicializa al cargar la página
let announcements = [];

/**
 * Carga los anuncios desde localStorage.
 * Si no hay anuncios, inicializa la lista como vacía.
 */
function loadAnnouncements() {
    const storedAnnouncements = localStorage.getItem('announcements');
    if (storedAnnouncements) {
        announcements = JSON.parse(storedAnnouncements);
    }
}

/**
 * Guarda los anuncios en localStorage.
 */
function saveAnnouncements() {
    localStorage.setItem('announcements', JSON.stringify(announcements));
}

/**
 * Renderiza todos los anuncios en la interfaz de usuario.
 */
function renderAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = '';

    announcements.forEach((announcement, index) => {
        const date = new Date(announcement.timestamp).toLocaleString('es-ES');
        
        const announcementItem = document.createElement('div');
        announcementItem.classList.add('announcement-item');
        announcementItem.innerHTML = `
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <p class="date">${date}</p>
            <div class="actions">
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
                <button class="share-btn" data-index="${index}">Compartir</button>
            </div>
        `;
        announcementsList.appendChild(announcementItem);
    });
}

/**
 * Agrega un nuevo anuncio a la lista.
 */
function addAnnouncement() {
    const titleInput = document.getElementById('announcementTitle');
    const contentInput = document.getElementById('announcementText');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
        const newAnnouncement = {
            title,
            content,
            timestamp: new Date().toISOString()
        };
        announcements.unshift(newAnnouncement); // Añade al principio
        saveAnnouncements();
        renderAnnouncements();
        titleInput.value = '';
        contentInput.value = '';
        showMessage('Anuncio publicado exitosamente.', 'success');
    } else {
        showMessage('Por favor, ingresa un título y un contenido.', 'error');
    }
}

/**
 * Muestra una ventana modal para editar un anuncio.
 * @param {number} index El índice del anuncio en el array.
 */
function showEditModal(index) {
    const announcement = announcements[index];
    if (!announcement) return;

    const modalContent = document.querySelector('#modalContainer .modal-content');
    modalContent.innerHTML = `
        <h3>Editar Anuncio</h3>
        <input type="text" id="editTitle" value="${announcement.title}">
        <textarea id="editContent" rows="4">${announcement.content}</textarea>
        <div class="modal-actions">
            <button id="cancelEditBtn">Cancelar</button>
            <button id="saveEditBtn" data-index="${index}">Guardar</button>
        </div>
    `;
    const modal = document.getElementById('modalContainer');
    modal.classList.add('visible');

    document.getElementById('saveEditBtn').addEventListener('click', () => saveEdit(index));
    document.getElementById('cancelEditBtn').addEventListener('click', hideModal);
}

/**
 * Guarda los cambios de un anuncio editado.
 * @param {number} index El índice del anuncio a editar.
 */
function saveEdit(index) {
    const newTitle = document.getElementById('editTitle').value.trim();
    const newContent = document.getElementById('editContent').value.trim();

    if (newTitle && newContent) {
        announcements[index].title = newTitle;
        announcements[index].content = newContent;
        saveAnnouncements();
        renderAnnouncements();
        hideModal();
        showMessage('Anuncio actualizado exitosamente.', 'success');
    } else {
        showMessage('Por favor, completa ambos campos.', 'error');
    }
}

/**
 * Muestra una ventana modal para confirmar la eliminación de un anuncio.
 * @param {number} index El índice del anuncio a eliminar.
 */
function showDeleteModal(index) {
    const modalContent = document.querySelector('#modalContainer .modal-content');
    modalContent.innerHTML = `
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
            <button id="cancelDeleteBtn">Cancelar</button>
            <button id="confirmDeleteBtn" data-index="${index}">Eliminar</button>
        </div>
    `;
    const modal = document.getElementById('modalContainer');
    modal.classList.add('visible');

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => deleteAnnouncement(index));
    document.getElementById('cancelDeleteBtn').addEventListener('click', hideModal);
}

/**
 * Elimina un anuncio de la lista.
 * @param {number} index El índice del anuncio a eliminar.
 */
function deleteAnnouncement(index) {
    announcements.splice(index, 1);
    saveAnnouncements();
    renderAnnouncements();
    hideModal();
    showMessage('Anuncio eliminado exitosamente.', 'success');
}

/**
 * Oculta la ventana modal.
 */
function hideModal() {
    const modal = document.getElementById('modalContainer');
    modal.classList.remove('visible');
}

/**
 * Copia el contenido de un anuncio al portapapeles.
 * @param {number} index El índice del anuncio.
 */
function copyToClipboard(index) {
    const announcement = announcements[index];
    const textToCopy = `Anuncio: ${announcement.title}\n\n${announcement.content}`;
    try {
        const el = document.createElement('textarea');
        el.value = textToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showMessage('Anuncio copiado al portapapeles.', 'success');
    } catch (err) {
        showMessage('Error al copiar el texto.', 'error');
    }
}

/**
 * Muestra un mensaje temporal al usuario.
 * @param {string} message El mensaje a mostrar.
 * @param {string} type El tipo de mensaje ('success' o 'error').
 */
function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
    messageBox.classList.add('message-box', type);
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.classList.add('visible');
    }, 10);

    setTimeout(() => {
        messageBox.classList.remove('visible');
        setTimeout(() => messageBox.remove(), 300);
    }, 3000);
}

// Inicialización de la aplicación cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadAnnouncements();
    renderAnnouncements();

    // Event listener para el botón de agregar
    document.getElementById('addAnnouncementBtn').addEventListener('click', addAnnouncement);

    // Delegación de eventos para los botones de la lista de anuncios
    document.getElementById('announcementsList').addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('edit-btn')) {
            const index = target.getAttribute('data-index');
            showEditModal(Number(index));
        } else if (target.classList.contains('delete-btn')) {
            const index = target.getAttribute('data-index');
            showDeleteModal(Number(index));
        } else if (target.classList.contains('share-btn')) {
            const index = target.getAttribute('data-index');
            copyToClipboard(Number(index));
        }
    });
});