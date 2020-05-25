import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const { env } = Deno;

const envObj = env.toObject();
const { PORT = 4000, HOST = '127.0.0.1' } = envObj;

const router = new Router();
const app = new Application();

interface Dog {
  name: string
  age: number
}

let dogs: Array<Dog> = [
  { name: 'Roger', age: 8 },
  { name: 'Syd', age: 7 },
];

const getDogs = ({ response }: { response: any }) => {
  response.body = dogs
}
const getDog = ({ params, response }: { params: { name: string }, response: any }) => {
  const dog = dogs.find(dog => dog.name === params.name);
  if (dog) {
    response.status = 200;
    response.body = dog;
    return
  }

  response.status = 404
  response.body = { msg: `Cannot find dog ${params.name}` }
}

const addDog = async ({ request, response }: { request: any, response: any }) => {
  const body = await request.body();
  const dog: Dog = body.value;
  dogs.push(dog);
  response.status = 201;
  response.body = { msg: 'OK' }
};

const updateDog = async ({ params: { name }, request, response }: { params: { name: string }, request: any, response: any }) => {
  const dog = dogs.find(item => item.name === name);
  if (dog) {
    const body = await request.body();
    dog.name = body.value.name;
    dog.age = body.value.age;
    response.status = 201;
    response.body = { msg: "OK" }
    return;
  }
  response.status = 404;
  response.body = { msg: `Cannot find dog ${name}` }
}

const removeDog = ({ params, response }: { params: { name: string }, response: any }) => {

  /*
  * more clever solution
  const lengthBefore = dogs.length
  dogs = dogs.filter((dog) => dog.name !== params.name)

  if (dogs.length === lengthBefore) {
    response.status = 400
    response.body = { msg: `Cannot find dog ${params.name}` }
    return
  }
  */
  const dog = dogs.find(item => item.name === params.name);
  if (dog) {
    dogs = dogs.filter(item => item.name !== params.name);
    response.status = 201;
    response.body = { msg: "OK" }
    return;
  }
  response.status = 404;
  response.body = { msg: `Cannot find dog ${params.name}` }
}

router
  .get('/dogs', getDogs)
  .get('/dogs/:name', getDog)
  .post('/dogs', addDog)
  .put('/dogs/:name', updateDog)
  .delete('/dogs/:name', removeDog)

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`server runs on http:${HOST}:${PORT}`);

await app.listen(`${HOST}:${PORT}`);