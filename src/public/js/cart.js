
// Espero que el DOM se cargue por completo
window.addEventListener('DOMContentLoaded', function() {
    const eliminarButton = document.getElementById('eliminar-item');
    const itemId = eliminarButton.dataset.itemId
    eliminarButton.addEventListener('click', function() {
        // Tu código de eliminación aquí
        axios.delete(`/api/carts/remove/${itemId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
              // Manejar la respuesta exitosa
                console.log('Elemento eliminado correctamente:', response.data);
                alert('Elemento eliminado correctamente');
                setTimeout(() => {
                    window.location.reload(); // Recargar la página después de 1 segundo
                }, 2000);
            })
            .catch(error => {
              // Manejar el error
                console.error('Error al eliminar elemento:', error);
            });
    });
});