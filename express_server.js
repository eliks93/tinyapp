const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const helpers = require('./helpers');
app.use(cookieSession({
  name: 'session',
  keys: ['Abacdsafdsafeadfds'],

}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//empty database objects -------->
const users = {
 
};

const urlDatabase = {
  
};


app.get("/urls/login/", (req, res) =>{
  let templateVars = {
    urls: helpers.urlsForUser([req.session.user_id], urlDatabase),
    user_id: req.session.user_id,
    user: users[req.session.user_id]
  };
  res.render("pages/urls_login", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: helpers.urlsForUser(req.session.user_id, urlDatabase),
    user_id: req.session.user_id,
    user: users[req.session.user_id]
  };
  res.render("pages/urls_index", templateVars);
  
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/urls/login/');
  } else {
    let templateVars = {
      user_id: req.session.user_id,
      user: users[req.session.user_id]
    };
    res.render("pages/urls_new", templateVars);
  }
});

app.get("/urls/register", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id,
    user: users[req.session.user_id]
  };
  res.render("pages/urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.send('401 Error Status Code: user not logged in');
    return;
  } else if (!urlDatabase[req.params.shortURL]) {
    res.send('404 Error Status Code, tiny url not found');
    return;
  } else if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.send('401 Error Status Code, not authorized');
  } else {
    let templateVars = { shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user_id: req.session.user_id,
      user: users[req.session.user_id],
      views: urlDatabase[req.params.shortURL].viewCount };
      
  
    res.render("pages/urls_show", templateVars);
  }
});

app.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/urls/login/');
  } else {
    res.redirect("/urls/");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.send('404 Error Status Code, tiny url not found');
    return;
  } else {
    let url = urlDatabase[req.params.shortURL].longURL;
    urlDatabase[req.params.shortURL].viewCount += 1;
 

    res.redirect(url);
  }
  
});

app.post("/logout/", (req, res) => {
  req.session = null;
  res.redirect('/urls/');
});

app.post("/urls/", (req, res) => {
  let user_id = req.session.user_id;
  req.body['shortURL'] = helpers.generateRandomString();
  let shortURL = req.body.shortURL;
  let date = new Date();
  let currentDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  urlDatabase[req.body.shortURL] = { longURL: helpers.isValid(req.body.longURL), userID: user_id, dateCreated: currentDate, viewCount: 0 };

  res.redirect('/urls/' + shortURL);
});


app.post("/urls/:shortURL/delete/", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  if (urlDatabase[templateVars.shortURL].userID === req.session.user_id) {
    delete urlDatabase[templateVars.shortURL];
    res.redirect('/urls');
    return;
  } else {
    res.redirect('/urls/');
  }
});

app.post("/urls/:shortURL/edit/", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  user_id: req.session.user_id,
    user: users[req.session.user_id] };
  
  res.redirect('/urls/' + templateVars.shortURL);
});

app.post("/urls/:shortURL/update/", (req, res) => {
  
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  if (urlDatabase[templateVars.shortURL].userID === req.session.user_id) {
    urlDatabase[templateVars.shortURL].longURL = helpers.isValid(req.body.longURL);
    res.redirect('/urls/');
    return;
  } else {
    res.redirect('/urls/');
  }
});

app.post("/urls/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send("400 Error Status code, invalid username or password");
    return;
  }
  if (helpers.getUserByEmail(req.body.email, users)) {
    res.send("400 Error Status code, email already in use");
    return;
  }
  let randomID = "user_" + helpers.generateRandomString();
  
  users[randomID] = {};
  users[randomID]['id'] = randomID;
  users[randomID]['email'] = req.body.email;
  users[randomID]['password'] = bcrypt.hashSync(req.body.password, 10);
  req.session.user_id = users[randomID].id;
  res.redirect('/urls/');
});

app.post("/urls/login", (req, res) => {
  const {email, password} = req.body;
  for (const user_id in users) {
    const user = users[user_id];
    if (user.email === email) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user_id = users[user_id].id;
        res.redirect('/urls/');
        return;
      } else {
        res.send('403: invalid password');
        return;
      }
    } else {
      res.send('403: invalid email');
      return;
    }
  }
  res.send('401: invalid credentials, account does not exist');
});
  

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
