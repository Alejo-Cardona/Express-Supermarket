// Función para crear el párrafo
function createP(selectedValue) {
    let contentDiv = document.getElementById('content-p');
    let p = document.createElement('p')
    p.id = 'selected-category'
    p.className = 'fs-5 text-success-emphasis'
    p.textContent = `Seleccionaste la categoria ${selectedValue}`
    contentDiv.appendChild(p);
}

// Espero que el DOM se cargue por completo
window.addEventListener('DOMContentLoaded', function() {
    let dropdownItems = document.querySelectorAll('.dropdown-item');
    let hiddenInput = document.getElementById('category');
    
    dropdownItems.forEach(function (item) {
        item.addEventListener('click', function (event) {
            // Obtiene el valor del atributo data-value del elemento clickeado
            let selectedValue = event.target.getAttribute('data-value');
            let selected = document.getElementById('selected-category')

            // Guarda el valor en el campo oculto
            hiddenInput.value = selectedValue;

            // Eliminar el párrafo anterior si existe
            if (selected) {
                selected.remove();
            }
            
            // Crear un nuevo párrafo con el valor seleccionado
            createP(selectedValue);
        });
    });
});