#!/usr/bin/env node

const hostServiceApi = require('./neocitiesApi');
const parseArgs = require('./arguments');
const readlineSync = require('readline-sync');

const { source, destination, files } = parseArgs();
const selected = files.map(file => ({
	source: file,
	destination: file.replace(source, destination)
}));

console.log('Files selected for deployment:');
selected.forEach(file =>
	console.log(`./${file.source} => ${file.destination}`)
);

const shouldContinue = readlineSync.question('Continue? Y/N: ').match(/^[Yy]$/);
if (!shouldContinue) return;

const username = readlineSync.question('Please enter username: ');
const password = readlineSync.question('Please enter password: ', {
	hideEchoBack: true
});

console.log('Deploying selected files...');
hostServiceApi.deploy(username, password, selected);
