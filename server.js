const { createApp } = require('./api/app');

const app = createApp();
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Soged server running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to view the application`);
    });
}

module.exports = app;
