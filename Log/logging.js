const axios = require('axios');

function logging() {
    return async (req, res, next) => {
        let data = {
            method: req.method,
            url: req.originalUrl,
            timestart: new Date().toISOString()
        };

        next();
        
        data.timeend = new Date().toISOString();
        try {
            await axios.post('http://localhost:3003/log', {data: data});
        } catch (error) {
            console.error('Error:', error.message);
        }

        
    };
}

module.exports = logging;