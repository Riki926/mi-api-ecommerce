const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const keys = require('./keys');

// Estrategia Local para login con email y password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Buscar usuario por email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        // Verificar password
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia JWT para autenticación con token
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id).populate('cart');
        
        if (user) {
            return done(null, user);
        }
        
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// Estrategia "current" para validar usuario logueado
passport.use('current', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id)
            .populate('cart')
            .select('-password');
        
        if (user) {
            return done(null, user);
        }
        
        return done(null, false, { message: 'Token is not valid' });
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;
