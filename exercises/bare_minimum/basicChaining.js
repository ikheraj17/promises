/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');



var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(readFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let filetext = data.toString();
        let endLine = filetext.indexOf('\n');
        let username = filetext.substring(0, endLine);
        resolve(username);
      }
    });
  })
    .then(function(username) {
      return new Promise((resolve, reject) => {
        request.get({url: 'https://api.github.com/users/' + username}, (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        });
      });
    })
    .then(function (bodyObj) {
      return new Promise((resolve, reject) => {
        fs.writeFile(writeFilePath, bodyObj, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
