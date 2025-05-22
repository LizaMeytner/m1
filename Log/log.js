const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3003;

app.use(express.json());

app.post('/log', (req, res) => {
    const data = req.body;
    console.log(data);
    fs.appendFile('./Log/logs.txt', JSON.stringify(data) + '\n', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err.message);
        }
        return res.status(200).json({message: 'ok'});
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
