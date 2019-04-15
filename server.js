const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

// Cors Header
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

// Cors Header
app.get('/', (req, res) => {
  res.send('nivetha is great!');
});

const CONTACTS_FILE = './contacts.json';

app.get('/contacts', (req, res) => {
  let content = fs.readFileSync(CONTACTS_FILE);
  let data = content.toString();
  res.json(JSON.parse(data));
});

app.get('/contactsDetails', (req, res) => {
  const id = req.query.id;
  const fileContent = fs.readFileSync(CONTACTS_FILE).toString();
  const contacts = JSON.parse(fileContent);
  const contact = contacts.find(item => item.id === parseInt(id));
  res.json(contact);
});

app.post('/addorEdit', urlencodedParser, function(req, res) {
  try {
    const fileContent = fs.readFileSync(CONTACTS_FILE).toString();
    let contacts = JSON.parse(fileContent);
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
        id: contacts.length + 1,
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

app.post('/addfavorate', urlencodedParser, function(req, res) {
  const id = req.body.id;
  // Delete Code
  res.json(successdata);
});

app.post('/removefavorate', urlencodedParser, function(req, res) {
  const name = req.body.contactName;
  // Delete Code
  res.json(successdata);
});

app.post('/delete', urlencodedParser, function(req, res) {
  const name = req.body.contactName;
  // Delete Code
  res.json(successdata);
});

app.listen(3000, () => console.log('app listening on port 3000!'));
