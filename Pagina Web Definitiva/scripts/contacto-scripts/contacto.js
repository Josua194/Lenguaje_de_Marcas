function enviarMensaje() {
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

   
    if (nombre && email && mensaje) {
        alert(`¡Gracias por ponerte en contacto con nosotros, ${nombre}!\nTu mensaje ha sido enviado exitosamente.`);

        document.getElementById('contactForm').reset();
    } else {
        
        alert('Por favor, completa todos los campos antes de enviar el mensaje.');
    }
}