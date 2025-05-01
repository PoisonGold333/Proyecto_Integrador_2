const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        
        console.log('Hasheando contraseña para:', this.email);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Nueva contraseña hasheada:', this.password);
        next();
    } catch (error) {
        console.error('Error al hashear contraseña:', error);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparando contraseñas para usuario:', this.email);
        console.log('Contraseña ingresada (length):', candidatePassword.length);
        console.log('Contraseña almacenada:', this.password);
        
        if (!candidatePassword || !this.password) {
            console.log('Contraseña vacía o no definida');
            return false;
        }

        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('¿Contraseñas coinciden?:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparando contraseñas:', error);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);