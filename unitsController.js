const express = require('express');
const Database = require('./units.js');
const logging = require('../Log/logging.js');

const app = express();
const PORT = 3001;
const db = new Database('./Units/dbunits.db');
const logWare = logging();

app.use(express.json());

app.use((req, res, next) => {
    logWare(req, res, next);
});

app.get('/units', async (req, res) => {
    try {
        const rows = await db.getAll();

        if (!rows) {
            return res.status(404).json({ error: 'Отсутсвуют данные' });
        }

        res.status(202).json({ message: 'Данные обнаружены', unit: rows });
    }
    catch (err) {
        console.error('Ошибка при получении объекта:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.get('/units/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const row = await db.getOne(id);
        if (!row) {
            return res.status(404).json({ error: 'Отсутсвуют данные' });
        }

        res.status(201).json({ message: 'Данные обнаружены', unit: row });
    }
    catch (err) {
        console.error('Ошибка при получении объекта:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.post('/units', async (req, res) => {
    try {
        const name = req.body.name;
        const img = req.body.imgName;

        if (!name || !img) {
            return res.status(400).json({ error: 'Отсутствует name или img' });
        }

        const newObj = {
            name: name,
            img: img
        };

        db.add(newObj);

        res.status(201).json({ message: 'Объект успешно добавлен', unit: newObj });
    } catch (err) {
        console.error('Ошибка при добавлении объекта:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.put('/units/:id', async (req, res) => {
    try {
        const name = req.body.name;
        const img = req.body.imgName;
        const { id } = req.params;

        if (!name || !img || !id) {
            return res.status(400).json({ error: 'Отсутствует name, img или id' });
        }

        const row = await db.getOne(id);
        if (!row) {
            return res.status(404).json({ error: 'Объект отсутсвует' });
        }

        const newObj = {
            name: name,
            img: img
        };

        db.update(id, newObj);

        res.status(201).json({ message: 'Объект успешно обновлен', id: id, unit: newObj });
    } catch (err) {
        console.error('Ошибка при обновлении объекта:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.delete('/units/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Отсутствует id' });
        }

        const row = await db.getOne(id);
        if (!row) {
            return res.status(404).json({ error: 'Объект отсутсвует' });
        }
        db.delete(id);

        res.status(201).json({ message: 'Объект успешно удален' });
    } catch (err) {
        console.error('Ошибка при удалении объекта:', err);
        res.status(500).json({ err: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});