Solution for - ["Build Your Own Git" Challenge](https://codecrafters.io/challenges/git).
The program is "./git.sh"

## Notes

### Stage #4 (Read a blob)

Approach:

1. Read the contents of the blob object file from the .git/objects directory
2. Decompress the contents using Zlib
3. Extract the actual "content" from the decompressed data
4. Print the content to stdout
