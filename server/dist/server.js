"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const start = async () => {
    const database = new database_1.Database();
    await database.connect();
    const app = new app_1.App();
    app.app.listen(env_1.env.port, () => {
        console.log(`Server running on http://localhost:${env_1.env.port}`);
    });
};
start().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});
