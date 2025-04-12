const bcrypt = require('bcrypt');

// Password to be hashed
const password = 'AdminSecretary';

// Hash the password
const saltRounds = 10; // Define cost factor
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});