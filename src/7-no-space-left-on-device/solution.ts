import * as path from 'path';
import * as fs from 'fs';

type File = {
  name: string;
  size: number;
}

type Directory = {
  name: string;
  contents: Array<File | Directory>;
  size: number;
  parent: Directory;
};

const filesystem: Directory = {
  name: '/',
  contents: [],
  size: null,
  parent: null,
};

const DISK_SIZE = 70000000;
const FREE_SPACE_REQUIRED_FOR_UPDATE = 30000000;
const MAX_SIZE_FOR_FILESYSTEM = DISK_SIZE - FREE_SPACE_REQUIRED_FOR_UPDATE;

const filename = path.join(__dirname, '../../src/7-no-space-left-on-device/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const buildFilesystem = () => {
  let currentDirectory: Directory;
  const lineRegex = /^(\$ )?([A-Za-z0-9./]+ )*([A-Za-z0-9./]+)/;

  for (let i = 0; i < data.length; i++) {
    const currentLine = data[i];
  
    if (!currentLine.length) {
      continue;
    }
  
    const regexResult = currentLine.match(lineRegex);
    const isCdCommand = Boolean(regexResult[1] && regexResult[2] === 'cd ');
    const isLsCommand = Boolean(regexResult[1] && regexResult[3] === 'ls');
    
    if (isCdCommand) {
      const dirName = regexResult[3];
  
      if (dirName === '/') {
        currentDirectory = filesystem;
      } else if (dirName === '..') {
        currentDirectory = currentDirectory.parent;
      } else {
        // we'll assume the input won't ask us to cd into a file
        currentDirectory = currentDirectory.contents.find(item => item.name === dirName) as Directory;
      }
    } else if (isLsCommand) {
      // oddly enough, this is a no-op scenario - since the only commands are cd and ls,
      // we don't really care if an ls occurs. its output will get processed in the next
      // else block. we just need to make sure we don't consider this line a directory/file
      // to add to the filesystem, and we're good to go.
    } else {
      const newName = regexResult[3];
      const newItem = regexResult[2] === 'dir ' ?
        {
          name: newName,
          contents: [],
          size: null,
          parent: currentDirectory,
        } :
        {
          name: newName,
          size: parseInt(regexResult[2], 10),
        };
  
      currentDirectory.contents.push(newItem);
    }
  }
};

const annotateWithSizes = (directory: Directory): number => {
  let size = 0;

  directory.contents.forEach(item => {
    if ("contents" in item) {
      size += annotateWithSizes(item);
    } else {
      size += item.size;
    }
  });

  directory.size = size;

  return size;
};

buildFilesystem();
annotateWithSizes(filesystem);

let sumOfSizesOfDirectoriesOfLessThanOneHundredThousand = 0;
let smallestDeletableDirectorySize = Infinity;

const recurseThroughDirectory = (directory: Directory) => {
  if (directory.size <= 100000) {
    sumOfSizesOfDirectoriesOfLessThanOneHundredThousand += directory.size;
  }

  if (filesystem.size - directory.size < MAX_SIZE_FOR_FILESYSTEM && directory.size < smallestDeletableDirectorySize) {
    smallestDeletableDirectorySize = directory.size;
  }

  directory.contents.forEach(item => {
    if ("contents" in item) {
      recurseThroughDirectory(item);
    }
  });
}

recurseThroughDirectory(filesystem);

// Part 1:
console.log(sumOfSizesOfDirectoriesOfLessThanOneHundredThousand);

// Part 1:
console.log(smallestDeletableDirectorySize);
