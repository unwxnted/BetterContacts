const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require("../lib/helpers");

async function checkValidPhone(phone){

    const arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for(let i = 0; i < arr.length; ++i){
        if(phone.includes(arr[i])) return false;
    }

    return true;
}

router.get('/add', (req, res) => {
    res.render('contacts/add');
});

router.post('/add', isLoggedIn,async (req, res) => {
    const { name, email, phone } = req.body;
    const user_id = req.user.id;
    const newContact = {
        name,
        email,
        phone,
        user_id
    };

    const validatedPhone = await checkValidPhone(phone);
    if(!validatedPhone){
        req.flash('error', 'Phone number is not valid')
        return res.redirect('/contacts/add');
    }
    await pool.query('INSERT INTO contacts set ?', [newContact]);
    console.log(`NEW CONTACT CREATED ${newContact.name}, ${newContact.email}, ${newContact.phone}`);
    req.flash('success', 'Contact saved successfully');
    res.status(200).redirect('/contacts');
});

router.get('/', isLoggedIn,async (req, res) =>{
    const contacts = await pool.query('SELECT * FROM contacts WHERE user_id = ?', [req.user.id]);
    res.render('contacts/list', {contacts});
});

router.get('/delete/:id', isLoggedIn,async (req, res) =>{
    const {id} = req.params;
    await pool.query('DELETE FROM contacts WHERE id=?', [id]);
    console.log(`Contact ${id} deleted`);
    req.flash('success', 'Contact deleted successfully');
    res.status(200).redirect('/contacts');
});

router.get('/edit/:id', isLoggedIn,async (req, res) =>{
    const {id} = req.params;
    const contacts = await pool.query('SELECT * FROM contacts WHERE id=?', [id]);
    res.render('contacts/edit', {contacts: contacts[0]});
});

router.post('/edit/:id',isLoggedIn, async (req, res) =>{

    const {id} = req.params;
    const {name, email, phone} = req.body;
    const newContact = {
        name,
        email,
        phone
    };
    const validatedPhone = await checkValidPhone(phone);
    if(!validatedPhone){
        req.flash('error', 'Phone number is not valid')
        return res.redirect('/contacts/add');
    }
    await pool.query('UPDATE contacts set ? WHERE id=?', [newContact, id]);
    console.log(`Contact ${id} updated`);
    req.flash('success', 'Contact updated successfully');
    res.status(200).redirect('/contacts');

});

module.exports = router;