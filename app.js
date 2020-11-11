const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const client = mysql.createConnection({
    user: 'root',
    password: 'root',
    database: 'quotes',
    port: 3306
});

app.get('/', (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {
    client.query(
        'SELECT * FROM items',
        (error, results) => {
            console.log(results);
            res.render('index.ejs', { items: results });
        }
    );
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/create', (req, res) => {
    client.query(
        'INSERT INTO items (name) VALUES(?)',
        [req.body.item],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.post('/delete/:id', (req, res) => {
    client.query(
        'DELETE FROM items WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});


app.get('/edit/:id', (req, res) => {
    client.query(
        'SELECT * FROM items WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', { item: results[0] });
        }
    );
});

app.post('/update/:id', (req, res) => {
    client.query(
        'UPDATE items SET name=? WHERE id=?',
        [req.body.item, req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.listen(3000);