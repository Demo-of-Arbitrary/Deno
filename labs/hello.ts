import {serve } from 'https://deno.land/std/http/server.ts';

const port = 8080;
const server = serve({port})
console.log(`http://localhost:${port}`)

for await (const req of server ) {
  req.respond({body: 'Hello world\n'});
}
