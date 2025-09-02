/* eslint-disable no-console */
console.log(`Hello from node ${process.version}`);
console.log('Hello');

function getName() {
    console.log('Hello Name');
    const user = {
        name: 'Hasan',
    };
    console.log(user.name);
}
console.log(getName());
