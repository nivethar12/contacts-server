const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
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
app.get('/contacts', (req, res) => {
  let content = fs.readFileSync('./contacts.json');
  let data = content.toString();
  res.json(JSON.parse(data));
});
app.get('/contactsDetails', (req, res) => {
  const id = req.query.id;
  console.log('iddddddddd', id);
  const content = fs.readFileSync('./contacts.json');
  const data = content.toString();
  const obj = JSON.parse(data);
  console.log(data);
  const contact = obj.find(item => item.id === parseInt(id));
  console.log(contact);
  res.json(contact);
});

app.post('addorEdit', urlencodedParser, function(req, res) {
  const name = req.body.contactName;
  console.log('contact', name);
  const successdata = {
    status: true,
    message: 'Record created - success',
  };
  const failuredata = {
    status: false,
    message: 'Error creating new account',
  };
  res.json(successdata);
});
app.listen(3000, () => console.log('app listening on port 3000!'));
