const { docopt } = require('docopt');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { version: packageVersion } = require('../package');

function validateDirectory(argument) {
	if (argument === '') return '';
	if (argument.endsWith('/')) return argument;
	return argument + '/';
}

function validateSource(argument) {
	argument = argument || './';
	return validateDirectory(argument);
}

function validateDestination(argument) {
	argument = argument || '';
	return validateDirectory(argument);
}

function validateIgnore(ignore) {
	ignore = ignore || [];
	if (
		(typeof ignore === 'string' && ignore.endsWith('/')) ||
		(typeof ignore !== 'string' && ignore.some(file => file.endsWith('/')))
	)
		throw new Error(`Ignore argument cannot be a directory.`);

	return ignore;
}

function mapIgnore(ignore, source) {
	if (typeof ignore === 'string') return source + ignore;
	return ignore.map(file => source + file);
}

module.exports = ({
	argv = process.argv.slice(2),
	version = packageVersion,
	exit = true
} = {}) => {
	const doc = fs.readFileSync(path.join(__dirname, 'help.txt'), {
		encoding: 'utf8'
	});
	const args = docopt(doc, { argv, version, exit });
	const source = validateSource(args['--source']);
	const destination = validateDestination(args['--dest']);
	const ignore = validateIgnore(args['--ignore']);
	const options = { nodir: true };
	options.ignore = mapIgnore(ignore, source);
	const files = glob.sync(source + '**', options);

	return {
		source,
		destination,
		files
	};
};
