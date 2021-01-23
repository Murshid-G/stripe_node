const express = require('express')
const keys = require('./config/key');
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const { stripePublishableKey } = require('./config/key_dev');

const app = express()

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

// bodybars middlebars
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

// static folder
app.use(express.static('${__dirname}/public'))

// index route
app.get('/', (req, res) => {
    res.render('index')
    stripePublishableKey = keys.stripePublishableKey
})
// charge route
app.post('/charge', (req, res) => {
    const amount = 2500;
    // console.log(req.body)
    // res.send('TEST')
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'Web Development Book',
        currency: 'usd',
        customers: customer.id
    }))
    .then(charge => res.render('success'))
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started ${port}`)
})