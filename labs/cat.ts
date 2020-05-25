const { args, open, copy, stdout } = Deno;
const filenames = args


for (const filename of filenames) {
  const file = await open(filename);
  await copy(file, stdout);
  file.close();
}