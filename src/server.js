const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const {database} = require('./keys');

const app = express();

require('./lib/passport');

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
app.use(session({
    secret: 'Bettercontacts best app ever',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash())
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
}))
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.error = req.flash('error');
  app.locals.user = req.user;
  app.locals.notUser = (req.user ? false : true)
  next();
});


app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/contacts', require('./routes/contacts'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
