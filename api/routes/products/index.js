const express = require('express');

const { save, getAll, getAllGoogle } = require('../../services/crm/products/products.service');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('products');
});

router.post('/addOneData', async (req, res) => {
  const data = req.body;
  try {
    await save(data);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false });
  }
});

router.post('/addAllData', async (req, res) => {
  const client = req.body;
  try {
    await save(client);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false });
  }
});

router.get('/getAllData', async (req, res) => {
  const data = await getAll();
  res.json({ ok: true, data: data });
});

router.get('/getAllDataGoogle', async (req, res) => {
  const data = await getAllGoogle();
  res.json({ ok: true, data: data });
});

module.exports = router;
