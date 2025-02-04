const mysql = require('mysql2/promise');

class Connection {

    constructor() {
        this.init();
    }

    async init() {

        try {
            this.connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '12345',
                database: 'room_management'
            });
            console.log('Connection Success');
        } catch (err) {
            console.error('Connection Not Success:', err.message);
        }

        

    }
}

module.exports = Connection;