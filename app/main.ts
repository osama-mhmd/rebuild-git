import * as fs from "fs";
import * as zlib from "node:zlib";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
}

switch (command) {
  case Commands.Init:
    // You can use print statements as follows for debugging, they'll be visible when running tests.
    console.error("Logs from your program will appear here!");

    // Uncomment this block to pass the first stage
    fs.mkdirSync(".git", { recursive: true });
    fs.mkdirSync(".git/objects", { recursive: true });
    fs.mkdirSync(".git/refs", { recursive: true });
    fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
    console.log("Initialized git directory");
    break;
  case Commands.CatFile:
    if (args[1] !== "-p") break; // Checking for the "-p" flag
    if (!args[2]) break; // Checking for the object name
    const buffer = fs.readFileSync(
      `.git/objects/${args[2].slice(0, 2)}/${args[2].slice(2)}`
    );
    zlib.unzip(buffer, (_, buf) => {
      // console.log(buf.toString().trim());
      const [typeAndSize, content] = buf.toString().split("\0");
      const [type, size] = typeAndSize.split(" ");
      process.stdout.write(content);
    });
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
