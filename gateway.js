const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const upload = multer();
const PORT = 3000;
const unitsURL = 'http://localhost:3001/units';
const filesURL = 'http://localhost:3002/files';

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${unitsURL}`);
        return res.status(response.status).json(response.data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

app.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`${unitsURL}/${req.params.id}`);
        return res.status(response.status).json(response.data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

app.post('/', upload.single('img'), async (req, res) => {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
        return res.status(400).json({ error: 'Поля name или img не указаны' });
    }

    try {
        // 1. Загрузить файл через FileStorage
        const formData = new FormData();
        formData.append('img', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const fileRes = await axios.post(`${filesURL}`, formData, {
            headers: formData.getHeaders(),
        });


        const filename = fileRes.data.file;

        // 2. Сохранить юнита через Units
        const unitRes = await axios.post(`${unitsURL}`, {
            name: name,
            imgName: filename,
        }, 
        {
            headers: {'Content-Type': 'application/json'}
        });

        return res.status(unitRes.status).json(unitRes.data);
    } catch (err) {
        console.error('Ошибка при добавлении объекта:', err.message);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.put('/:id', upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file;

    if (!name || !file || !id) {
        return res.status(400).json({ error: 'Поля name, img или id не указаны' });
    }

    try {
        const response = await axios.get(`${unitsURL}/${id}`);
        if (!response.data.unit){
            return res.status(response.status).json(response.data);
        }
        const delImg = response.data.unit.img;

        const formData = new FormData();
        formData.append('img', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        formData.append('delImg', delImg);

        const fileRes = await axios.put(`${filesURL}`, formData, {
            headers: formData.getHeaders(),
        });

        const filename = fileRes.data.file;

        const unitRes = await axios.put(`${unitsURL}/${id}`, {
            name: name,
            imgName: filename,
        });

        return res.status(unitRes.status).json(unitRes.data);
    } catch (err) {
        console.error('Ошибка при обновлении объекта:', err.message);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${unitsURL}/${id}`);
        if (!response.data.unit){
            return res.status(response.status).json(response.data);
        }

        await axios.delete(`${unitsURL}/${id}`);

        await axios.delete(`${filesURL}`, {
            data: {
                delImg: response.data.unit.img,
            },
        });

        return res.status(200).json({ message: 'Объект успешно удален' });
    } catch (err) {
        console.error('Ошибка при удалении объекта:', err.message);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});