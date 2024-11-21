import * as crypto from "node:crypto";
import * as fs from "fs";
import * as zlib from "node:zlib";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
  HashObject = "hash-object",
  LsTree = "ls-tree",
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
      const [typeAndSize, content] = buf.toString().split("\0");
      const [type, size] = typeAndSize.split(" ");
      process.stdout.write(content);
    });
    break;
  case Commands.HashObject:
    if (args[1] !== "-w") break; // Checking for the "-w" flag
    if (!args[2]) break; // Checking for the file name
    const buf = fs.readFileSync(args[2]);
    const hash = crypto.createHash("sha1");
    hash.update(buf);
    const name = hash.digest("hex");
    process.stdout.write(name);
    fs.mkdirSync(`.git/objects/${name.slice(0, 2)}`, { recursive: true });
    fs.writeFileSync(
      `.git/objects/${name.slice(0, 2)}/${name.slice(2)}`,
      zlib.deflateSync(Buffer.from(`blob ${buf.byteLength}\0${buf.toString()}`))
    );
    break;
  case Commands.LsTree:
    if (args[1] !== "--name-only") break; // Checking for the "--name-only" flag
    if (!args[2]) break; // Checking for the tree name
    const treeBuf = fs.readFileSync(
      `.git/objects/${args[2].slice(0, 2)}/${args[2].slice(2)}`
    );
    zlib.inflate(treeBuf, (_, buf) => {
      const content = buf
        .toString()
        .split("\0")
        .slice(1, -1)
        .reduce(
          (acc: string[], cur) => [...acc, cur.split(" ").at(-1) as string],
          []
        );
      console.log(content.join("\n"));
    });
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
