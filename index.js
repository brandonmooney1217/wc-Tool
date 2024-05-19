#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import {promises as pr } from 'fs';

program
  .version("1.0.0")
  .description("My version of the wc linux command")
  .argument('[file...]', 'file name')
  .option("-c, --size", "file size in bytes")
  .option ("-m, --chars", "chars in file")
  .option("-l, --lines", "lines in file")
  .option("-w, --words", "words in file")
  .action((input, options) => {

    if (input.length > 0) {

      var file = input[0];
      const isTextFileBoolean = isTextFile(file);

      if (isTextFileBoolean) {
        const promise = getData(file);
        promise.then((data) => {
          var data_array = getFileStats(data);
          printOutputs(data_array, options, file);
        });
      } 
      else {
        console.log("Usage: wcb [options] [file...] ");
      }
    }
    else {
      var fileContents;
      try {
        fileContents = fs.readFileSync(0);
        var data_array = getFileStats(fileContents.toString());
        printOutputs(data_array, options, file);

      } catch (err) {
          console.log("Usage: wcb [options] [file...] ");
      }
    }
  });

  function getFileStats(data) {

    const byte_size = str => new Blob([str]).size; 

    var bytes = byte_size(data)
    var data_array = data.split('\n');
    var line_count = data_array.length - 1;
    var word_count = 0;
    var char_count = 0

    for (var i = 0; i < data_array.length; ++i) {
      var line = data_array[i];
      char_count += line.length;
      word_count += line.split(" ").length;
    }
    return [line_count, word_count, char_count, bytes];
  }

  async function getData(file) {
    const data = pr.readFile(file, 'binary'); 
    return data;
  }

  function isTextFile(file) {
    if (file.length < 3) {
      return false;
    } 
    var file_array = file.split(".");

    return file_array.length >=2 && file_array[file_array.length-1] === 'txt'
  }

  function printOutputs(data_array, options, file) {
    // helper function to get word, line and char counts
    var line_count = data_array[0];
    var word_count = data_array[1];
    var char_count = data_array[2];
    var file_size = data_array[3]

    // Default option
    if (!options.lines && !options.chars && !options.words && !options.size) {
      console.log(`  ${file_size}  ${line_count}  ${word_count}  ${file}`);
    }

    // Size option
    if (options.size) {
      console.log(`  ${file_size}  ${file}`);
    }


    // Lines option
    if (options.lines) {
      console.log(`  ${line_count}  ${file}`)
    }

    // Chars options
    if (options.chars) {
      console.log(`  ${char_count}  ${file}`)
    }

    // Words option
    if (options.words) {
      console.log(`  ${word_count}  ${file}`)
    }
  }

  program.parse(process.argv);





