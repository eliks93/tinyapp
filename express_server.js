const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generates a random string
function generateRandomString() {
  let count = 0;
  let string = ""
  let randomNumbers = [];
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (count < 6) { 
  randomNumbers.push(Math.round(Math.random() * 61))
  count += 1;
  }
  for (const number of randomNumbers) {
    string += alphaNumeric[number];
  }
  return string;
}

// email check function to see if it already exists in database
// returns true if the email is already in database
// return false if email is unique

function emailLookUp (email) {
  for(const key in users ) {
    
    if(users[key]['email'] === email) {
      return true
    }
  }
  return false
}




app.get("/urls/login/", (req, res) =>{
  let templateVars = { 
    urls: urlDatabase,
    user_id: req.cookies.user_id,
    user: users[req.cookies.user_id]
  };
  res.render("pages/urls_login", templateVars)
})
app.get("/urls", (req, res) => {
  
  let templateVars = { 
    urls: urlDatabase,
    user_id: req.cookies.user_id,
    user: users[req.cookies.user_id]
  };
  res.render("pages/urls_index", templateVars);
});



app.post("/logout/", (req, res) => {
  
 
  res.clearCookie('user_id')
  res.redirect('/urls/')
})

app.post("/urls/", (req, res) => {
  req.body['shortURL'] = generateRandomString()
  let shortURL = req.body.shortURL;
  urlDatabase[req.body.shortURL] = req.body.longURL;
  res.redirect('/urls/' + shortURL);      
})



app.post("/urls/:shortURL/delete/", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  delete urlDatabase[templateVars.shortURL]
  res.redirect('/urls/')
})

app.post("/urls/:shortURL/edit/", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  user_id: req.cookies.user_id,
    user: users[req.cookies.user_id] };
  
  res.redirect('/urls/' + templateVars.shortURL)
})

app.post("/urls/:shortURL/update/", (req, res) => {
  
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  user_id: req.cookies.user_id,
    user: users[req.cookies.user_id]  };
  
  urlDatabase[templateVars.shortURL] = req.body.longURL
  res.redirect('/urls/')
})

app.post("/urls/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.send("400 Error Status code, invalid username or password")
  }
  if(emailLookUp(req.body.email)) {
    res.send("400 Error Status code, email already used")
  }
  let randomID = "user" + generateRandomString();
  
  users[randomID] = {}
  users[randomID]['id'] = randomID
  users[randomID]['email'] = req.body.email;
  users[randomID]['password'] = req.body.password;
  console.log(users)
  res.cookie('user_id', users[randomID].id)
  res.redirect('/urls/');
});

app.post("/urls/login", (req, res) => {
  const {email, password} = req.body
  for (const user_id in users) {
    const user = users[user_id];
    console.log(user)
    if (user.email === email) {
      if (user.password === password) {
        // log the user in (return) res.send
        res.cookie('user_id', user_id);
        res.redirect('/urls/');
        return 
      }  
    }
  }
 res.send('403, invalid password or email')
});
  


app.get("/urls/new", (req, res) => {
  let templateVars = {
  user_id: req.cookies.user_id,
  user: users[req.cookies.user_id]
  }

  console.log(templateVars.user)
  console.log(templateVars.user_id)
  res.render("pages/urls_new", templateVars);
});

app.get("/urls/register", (req, res) => {
  let templateVars = {
    user_id: req.cookies.user_id,
    user: users[req.cookies.user_id]
  }

  res.render("pages/urls_register", templateVars);
});




app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: req.cookies.user_id,
    user: users.user_id };
    
  res.render("pages/urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
