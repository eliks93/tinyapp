const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


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



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/urls", (req, res) => {
  
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username'] 
  };
  res.render("pages/urls_index", templateVars);
});

app.post("/login/", (req, res) => {
  
  // console.log(req.body.username)
  res.cookie('username', req.body['username'])
  res.redirect('/urls/')
})

app.post("/logout/", (req, res) => {
  
  console.log(req.cookies)
  res.clearCookie('username')
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username']  };
  console.log(templateVars)
  res.redirect('/urls/' + templateVars.shortURL)
})

app.post("/urls/:shortURL/update/", (req, res) => {
  console.log(req.body)
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username']  };
  
  urlDatabase[templateVars.shortURL] = req.body.longURL
  res.redirect('/urls/')
})

app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["username"]
  }
  res.render("pages/urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username'] };
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
