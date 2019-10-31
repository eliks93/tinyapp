// takes in a user email and a the users database and returns a user if found, else it returns false

const getUserByEmail = (email, database) => {
  for (const key in database) {
    if (database[key].email === email) {
      return key
    }
  }
  return false
}

// creates a user database containing only the users short url key value pairs given an database of users and an id

const urlsForUser = (id, database) => {
  let userDatabase = {};
  for (const url in database) {
    if (database[url].userID === id) {
      userDatabase[url] = database[url];
    }
  }
  return userDatabase;
};

// generates a random 6 character long alphanumeric string

const generateRandomString = () => {
  let count = 0;
  let string = "";
  let randomNumbers = [];
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (count < 6) {
    randomNumbers.push(Math.round(Math.random() * 61));
    count += 1;
  }
  for (const number of randomNumbers) {
    string += alphaNumeric[number];
  }
  return string;
};

// takes a given url and if it has http at the begining it leaves it returns it, if it doesnt it changes it to have http

const isValid = (input) => {
  let result = input.match(/http/g);
  if(result) {
    return input
  } else {
    return "http://" + input
  }
}


module.exports = { getUserByEmail, urlsForUser, generateRandomString, isValid };