import fs from "fs";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}


// isValidURL
// helper function to check if a string is valid URL
// INPUTS
//    stringToValidate as a string
// OUTPUTS
//    boolean True if valid, False if not valid
export function isValidURL(stringToValidate: string): boolean {
  try {
    return Boolean(new URL(stringToValidate));
  }
  catch (e) {
    return false;
  }
}

// getExtension
// helper function to split the format from the last "."
// INPUTS
//    filename as a string
// OUTPUT
//    string after the last point
function getExtension(filename: string): string {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

// isValidFormat
// helper function to validate file format
// The formats a according to jim documentation on : https://www.npmjs.com/package/jimp
// INPUTS
//    filename as a string
// OUTPUT
//    true if format is valid else false
export function isValidFormat(filename: string): boolean {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'bmp':
    case 'tiff':
    case 'gif':

      return true;
  }
  return false;
}

