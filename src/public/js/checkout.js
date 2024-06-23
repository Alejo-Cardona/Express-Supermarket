// Espero que el DOM se cargue por completo
window.addEventListener('DOMContentLoaded', function() {
    let buttonPay = document.getElementById('button-payment');
    const cartId = buttonPay.dataset.cart

    buttonPay.addEventListener('click', function() {
        axios.post(`/api/carts/${cartId}/purchase`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
              // Manejar la respuesta exitosa
                console.log('Compraste: ', response.data);
                alert('Gracias por tu Compra! Se envio el ticket a tu correo con el código de seguimineto')
            })
            .catch(error => {
              // Manejar el error
                console.error('Error: ', error);
            });
    });
});