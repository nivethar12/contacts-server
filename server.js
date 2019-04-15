const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

app.use(function(req, res, next) {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('nivetha is great!');
});

const CONTACTS_FILE = './contacts.json';

const getContacts = () => {
  const content = fs.readFileSync(CONTACTS_FILE);
  const data = content.toString();
  return JSON.parse(data);
};

const saveContacts = contacts => {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
};

app.get('/contacts', (req, res) => {
  res.json(getContacts());
});
app.get('/contactsDetails', (req, res) => {
  const id = req.query.id;
  const contacts = getContacts();
  const contact = contacts.find(item => item.id === parseInt(id));
  res.json(contact);
});

app.post('/addorEdit', urlencodedParser, function(req, res) {
  try {
    let contacts = getContacts();
    const payload = req.body;
    if (payload.id) {
      contacts = contacts.map(contact => {
        if (contact.id == payload.id) {
          contact.contactName = payload.contactName;
          contact.mobile = payload.mobile;
          contact.email = payload.email;
        }
        return contact;
      });
    } else {
      contacts.push({
        contactImage: 'assets/images/man.png',
        contactName: payload.contactName,
        mobile: payload.mobile,
        email: payload.email,
        favourite: false,
        id: shortid.generate(),
      });
    }
    console.log(contacts);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    res.json({
      status: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
    });
  }
});

app.post('/addfav', urlencodedParser, function(req, res) {
  const id = req.body.id;
  try {
    const contacts = getContacts();
    const contactUpdated = contacts.map(contact => {
      if (contact.id == id) {
        contact.favourite = true;
      }
      return contact;
    });
    saveContacts(contactUpdated);
    res.json({status: true});
  } catch (e) {
    res.status(500).json({
      status: false,
    });
  }
});

app.post('/removefav', urlencodedParser, function(req, res) {
  const id = req.body.id;
  try {
    const contacts = getContacts();
    const contactUpdated = contacts.map(contact => {
      if (contact.id == id) {
        contact.favourite = false;
      }
      return contact;
    });
    saveContacts(contactUpdated);
    res.json({status: true});
  } catch (e) {
    res.status(500).json({
      status: false,
    });
  }
});

app.post('/delete', urlencodedParser, function(req, res) {
  const id = req.body.id;
  try {
    const contacts = getContacts();
    const contactUpdated = contacts.filter(contact => contact.id !== id);
    saveContacts(contactUpdated);
    res.json({status: true});
  } catch (e) {
    res.status(500).json({
      status: false,
    });
  }
});

app.listen(3000, () => console.log('app listening on port 3000!'));
module.exports = app;
