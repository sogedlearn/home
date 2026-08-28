const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
        return { ok: false, error: 'Ingresa un correo electrónico válido.' };
    }
    return { ok: true, email: email.trim().toLowerCase() };
}

function validatePassword(password) {
    if (typeof password !== 'string') {
        return { ok: false, error: 'La contraseña es requerida.' };
    }
    if (password.length < 8) {
        return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return { ok: false, error: 'La contraseña debe incluir al menos una letra y un número.' };
    }
    return { ok: true };
}

function mapAuthError(message = '') {
    const lower = message.toLowerCase();
    if (lower.includes('already registered') || lower.includes('already been registered')) {
        return 'Este correo ya está registrado.';
    }
    if (lower.includes('invalid login credentials')) {
        return 'Correo o contraseña incorrectos.';
    }
    if (lower.includes('email not confirmed')) {
        return 'Confirma tu correo electrónico antes de iniciar sesión.';
    }
    if (lower.includes('expired')) {
        return 'El enlace expiró. Solicita uno nuevo.';
    }
    if (lower.includes('invalid') && lower.includes('token')) {
        return 'El enlace no es válido. Solicita uno nuevo.';
    }
    if (lower.includes('same password') || lower.includes('should be different')) {
        return 'La nueva contraseña debe ser distinta a la anterior.';
    }
    return message || 'No se pudo completar la operación.';
}

module.exports = {
    validateEmail,
    validatePassword,
    mapAuthError
};
