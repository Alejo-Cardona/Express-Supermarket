
// Espero que el DOM se cargue por completo
window.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.button-delete-product');

    deleteButtons.forEach(button => {
        const productId = button.dataset.idProduct

        button.addEventListener('click', function() {
            // Tu código de eliminación aquí
            axios.delete(`/api/products/remove/${productId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                  // Manejar la respuesta exitosa
                    console.log('Elemento eliminado correctamente:', response.data);
                    alert('Producto eliminado correctamente')
                    setTimeout(() => {
                        window.location.reload(); // Recargar la página después de 1 segundo
                    }, 2000);
                })
                .catch(error => {
                  // Manejar el error
                    console.error('Error al eliminar elemento:', error);
                });
        });
    })

    // CHANGE PREMIUM USER BUTTON

    const premiumButton = document.getElementById('button-premium')
        const userId = premiumButton.dataset.idUser

        premiumButton.addEventListener('click', function() {
            axios.put(`/api/users/premium/${userId}`, {
            })
                .then(response => {
                  // Manejar la respuesta exitosa
                    console.log('Solicitud enviada correctamente: ', response.data);
                    alert('El usuario se convirtio en premium')
                    setTimeout(() => {
                        window.location.reload(); // Recargar la página después de 1 segundo
                    }, 2000);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        const div = document.getElementById("premiumMsj")
                        
                        // LINK
                        const link = document.createElement('a')
                        link.href = '/users/documents-form';
                        link.textContent = 'Cargar documentos';
                        
                        // RESPONSE
                        const msj = document.createElement('p')
                        msj.textContent = `${error.response.data.message} Ingresa al Link para subir los documentos que te faltan: `
                        
                        msj.appendChild(link)
                        div.appendChild(msj)
                    } else {
                        console.error("se produjo un error", error)
                    }
                    

                });
        });

});