// Espero que el DOM se cargue por completo
window.addEventListener('DOMContentLoaded', function() {
    // Boton para eliminar usuarios inactivos
    const deleteUsersInactiveBtn = document.getElementById('button-inactive');
    
    deleteUsersInactiveBtn.addEventListener('click', function() {
        axios.delete(`/api/users/`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
              // Manejar la respuesta exitosa
                console.log('usuarios eliminados correctamente:', response.data);
                alert('Se eliminaron los usuarios inactivos')
                setTimeout(() => {
                    window.location.reload(); // Recargar la página después de 1 segundo
                }, 2000);

            })
            .catch(error => {
              // Manejar el error
                console.error('Error al eliminar usuarios:', error);
            });
    });

    // Botones para eliminar usuarios
    let deleteUserBtns = document.querySelectorAll('.button-delete-user');
    
    deleteUserBtns.forEach(function (item) {
        item.addEventListener('click', function (event) {
            // Obtiene el valor del atributo data-value del elemento clickeado
            let userId = item.getAttribute('data-id-user');
            
            axios.delete(`/api/users/remove/${userId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                  // Manejar la respuesta exitosa
                    console.log('usuarios eliminados correctamente:', response.data);
                    alert('Usuario eliminado correctamente')
                    setTimeout(() => {
                        window.location.reload(); // Recargar la página después de 1 segundo
                    }, 2000);
                })
                .catch(error => {
                  // Manejar el error
                    console.error('Error al eliminar usuarios:', error);
                });
        });
    });
    // Botones para cambiar el role del usuario
    let dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(function (item) {
        item.addEventListener('click', function (event) {
            // Obtiene el valor del atributo data-value del elemento clickeado
            let userId = item.getAttribute('data-id-user');
            let role = item.getAttribute('data-value')
            
            
            axios.put(`/api/users/change-role/${userId}`,{}, {
                params: {
                    role: role
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                  // Manejar la respuesta exitosa
                    alert('Se cambio el role del usuario correctamente');
                    setTimeout(() => {
                        window.location.reload(); // Recargar la página después de 1 segundo
                    }, 2000);
                })
                .catch(error => {
                  // Manejar el error
                    console.error('Error al cambiar el role del usuario:', error);
                });
                
        });
    });
});