module.exports = {
    'port': 3000,
    'host': 'http://localhost:3000/',
    'secret': 'jeanpayesonmetre',
    'database': 'mongodb://localhost:27017/sharebon',
    'admin': {
        'email': 'remy.bernardgranger@ynov.com',
        'firstName': 'Rémy',
        'lastName': 'Bernard-Granger',
        'password': 'password'
    },
    'debug': {
        'utility': false,
        'log': false,
        'user': false,
        'advert': true,
    },
    'tokenDuration': 60*60*24 * 365 // 1 an
};