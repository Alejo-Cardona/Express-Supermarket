import customId from "custom-id";

const generateCustomCode = () => {
    const id = customId({
        randomLength: 8, // Longitud de la parte aleatoria
        lowerCase: false, // No usar caracteres en minúscula
        upperCase: true, // Usar caracteres en mayúscula
        digits: true // Incluir dígitos
    });
    return id;
};

export default generateCustomCode