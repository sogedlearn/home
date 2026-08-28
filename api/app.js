try { require('dotenv').config(); } catch { /* optional in tests */ }
const express = require('express');
const path = require('path');
const chatRouter = require('./chat');
const updateCocosRouter = require('./update-cocos');
const userSettingsRouter = require('./v1/user-settings');
const progressRouter = require('./v1/progress');
const economyRouter = require('./v1/economy');

function createApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..')));

    app.use('/api/chat', chatRouter);
    app.use('/api/update-cocos', updateCocosRouter);
    app.use('/api/v1/user/settings', userSettingsRouter);
    app.use('/api/v1/progress', progressRouter);
    app.use('/api/v1/economy', economyRouter);

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

    app.get('/home', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

    return app;
}

module.exports = { createApp };
