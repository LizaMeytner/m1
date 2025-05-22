const express = require('express');
const FileStorage = require('./filestorage.js');
const logging = require('../Log/logging.js');

const app = express();
const PORT = 3002;
const storage2 = new FileStorage('./FileStorage/images');
const logWare = logging();

app.use(express.json());

app.use((req, res, next) => {
    logWare(req, res, next);
});

app.post('/files', storage2.saveFile('img'), async (req, res) => {
    try {
        const img = req.file ? req.file.filename : null;

        if (!img) {
            return res.status(400).json({ error: 'Отсутствует img' });
        }

        res.status(201).json({ message: 'Файл скачался успешно', file: img });
    } catch (err) {
        console.error('Ошибка при скачивании файла:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.put('/files', storage2.saveFile('img'), async (req, res) => {
    const img = req.file ? req.file.filename : null;
    try {
        const delImg = req.body.delImg;
        console.log(delImg);

        storage2.deleteFile(delImg);

        res.status(201).json({ message: 'Файл скачался успешно', file: img });
    } catch (err) {
        if (img){
            storage2.deleteFile(img);
        }
        console.error('Ошибка при изменении файла:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.delete('/files', async (req, res) => {
    try {
        const delImg = req.body.delImg;
        storage2.deleteFile(delImg);

        res.status(201).json({ message: 'Файл удален успешно' });
    } catch (err) {
        console.error('Ошибка при удалении файла:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});