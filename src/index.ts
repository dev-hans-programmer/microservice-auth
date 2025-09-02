import Config from './config';

 
console.log(`Hello from node ${process.version}`);
console.log('Hello');
console.log(Config.PORT);
const getName = () => {
  console.log('Hello Name');
  const user = {
    name: 'Hasan',
    age: 26,
  };
  console.log(user.name);
};
console.log(getName());
