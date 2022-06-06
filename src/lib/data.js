/**
 * Title: Data handling library
 * Description: handling data read / write/delete/update
 * Author: M.h Sajjad Hossain Ripon
 * Author's Github: https://github.com/mhsajjadhossain
 * Data: Fri,2022-06-03
 * Time: 20:47:47.000-05:00
 */

// dependencies
const fs = require("fs");
const path = require("path");
// lib object - module scaffolding.
const lib = {};

// base directory path of .data
lib.config = {
  baseDir: path.join(__dirname, "/../.data/"),
};

// write data to a file
lib.create = (dir, file, data, callback) => {
  const fileToWrite = path.join(lib.config.baseDir, dir, `${file}.json`);
  // open file to writing
  fs.open(fileToWrite, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);
      // write data to file and then close it
      fs.writeFile(fileDescriptor, stringData, (writingErr) => {
        if (!writingErr) {
          callback(false);
          fs.close(fileDescriptor, (closingErr) => {
            if (!closingErr) {
              callback(false);
            } else {
              callback("Error: Some issue to close file");
            }
          });
        } else {
          callback("Error: Some issue to write file");
        }
      });
    } else {
      callback(err);
    }
  });
  console.log("fileToWrite :", fileToWrite);
};
// read data from file
lib.read = (dir, file, callback) => {
  const fileToRead = path.join(lib.config.baseDir, dir, `${file}.json`);
  // reading file
  fs.readFile(fileToRead, "utf-8", (err, data) => {
    callback(err, data);
  });
};
// update data to file
lib.update = (dir, file, data, callback) => {
  const fileToWrite = path.join(lib.config.baseDir, dir, `${file}.json`);
  // open file to writing
  fs.open(fileToWrite, "r+", (openErr, fileDescriptor) => {
    if (!openErr) {
      callback(false);
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (truncateErr) => {
        if (!truncateErr) {
          fs.writeFile(fileDescriptor, stringData, (writingErr) => {
            if (!writingErr) {
              callback(false);
              fs.close(fileDescriptor, (closingErr) => {
                if (!closingErr) {
                  callback(false);
                } else {
                  callback("Error: There have some issues to close file");
                }
              });
            } else {
              callback("Error: There have some issues to update/write file");
            }
          });
        } else {
          callback("Error: There have some issues to truncate file");
        }
      });
    } else {
      callback(
        "Error: There have some issue in file update.file may doesn't exist"
      );
    }
  });
};
// delete file
lib.delete = (dir, file, callback) => {
  const fileToDelete = path.join(lib.config.baseDir, dir, `${file}.json`);
  // deleting file
  fs.unlink(fileToDelete, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error: there have issue for deleting file");
    }
  });
};

// exporting module
module.exports = lib;
