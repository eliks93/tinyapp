const { assert } = require('chai');

const { getUserByEmail, isValid } = require('../helpers.js');

const testUsers = {
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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput)
  });
  it('should return false when passed an email that does not exist', () => {
    const user = getUserByEmail('DOES NOT EXIST', testUsers)
    const expectedOutput = false
    assert.equal(user, expectedOutput);
  })
});

describe('isValid', function() {
  it('should return a URL with http:// added to it if passed a URL without it', function() {
    const url = isValid('tacos.com')
    const expectedOutput = "http://tacos.com";
    assert.equal(url, expectedOutput)
  });
  it('should return the same url if passed a URL with HTTP or HTTPS', () => {
    const url = isValid('http://tacos.com')
    const expectedOutput = "http://tacos.com";
    assert.equal(url, expectedOutput)
  })
});

