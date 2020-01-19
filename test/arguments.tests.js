const test = require('tape');
const { packageVersion = '' } = require('../package');
const parseArgs = require('../src/arguments');

const usage = /Usage: neocities-deploy \[--source=<dir>\] \[--dest=<uri>\] \[--ignore=<file>\]... \[-h|--help|--version\]'/;

function args(args = []) {
	return {
		argv: args,
		exit: false
	};
}

function testArgumentValueSupplied(argument) {
	test('Exported function', assert => {
		assert.throws(
			() => parseArgs(args([`--${argument}`])),
			new RegExp(`--${argument} requires argument`),
			`should throw if ${argument} argument value not specified.`
		);
		assert.end();
	});
}

function testMultipleArgumentsSupplied(argument) {
	test('Exported function', assert => {
		assert.throws(
			() => parseArgs(args([`--${argument}`, 'a', `--${argument}`, 'b'])),
			usage,
			`should throw if  multiple ${argument} arguments supplied.`
		);
		assert.end();
	});
}

function sourceArgumentTests() {
	test('Exported function', assert => {
		assert.equal(
			parseArgs(args()).source,
			'./',
			'should return default source.'
		);

		assert.equal(
			parseArgs(args(['--source', '.'])).source,
			'./',
			'should add a trailing slash to source if none.'
		);

		assert.isEquivalent(
			parseArgs(args(['--source', 'test/a'])).files,
			['test/a/a.txt', 'test/a/a/a.txt', 'test/a/b.txt'],
			'should return all files in source directory and subdirectories if no ignore argument.'
		);

		assert.end();
	});

	testMultipleArgumentsSupplied('source');
	testArgumentValueSupplied('source');
}

function destinationArgumentTests() {
	test('Exported function', assert => {
		assert.equal(
			parseArgs(args()).destination,
			'',
			'should return default destination.'
		);

		assert.equal(
			parseArgs(args(['--dest', '.'])).destination,
			'./',
			'should add a trailing slash to supplied destination if none.'
		);

		assert.equal(
			parseArgs(args()).destination,
			'',
			'should not add a trailing slash to destination if not supplied.'
		);

		assert.end();
	});

	testArgumentValueSupplied('dest');
	testMultipleArgumentsSupplied('dest');
}

function ignoreArgumentsTest() {
	test('Exported function', assert => {
		assert.isEquivalent(
			parseArgs(args(['--source', 'test/a', '--ignore', 'a/a.txt'])).files,
			['test/a/a.txt', 'test/a/b.txt'],
			'should ignore ignored files.'
		);

		assert.isEquivalent(
			parseArgs(
				args(['--source', 'test/a', '--ignore', 'a/a.txt', '--ignore', 'a.txt'])
			).files,
			['test/a/b.txt'],
			'should ignore ignored files if multiple arguments supplied.'
		);

		assert.isEquivalent(
			parseArgs(args(['--source', 'test/a', '--ignore', 'a/*'])).files,
			['test/a/a.txt', 'test/a/b.txt'],
			'should ignore ignored wildcard files.'
		);

		assert.throws(
			() => parseArgs(args(['--ignore', 'a/'])).files,
			/Ignore argument cannot be a directory/,
			'should throw if ignore argument has trailing slash.'
		);

		assert.end();
	});

	testArgumentValueSupplied('ignore');
}

function versionArgumentTests() {
	test('Exported function', assert => {
		assert.throws(
			() => parseArgs(args(['--version'])).files,
			new RegExp(packageVersion),
			'should print version.'
		);
		assert.end();
	});
}

function helpArgumentTests() {
	test('Exported function', assert => {
		assert.throws(
			() => parseArgs(args(['--help'])).files,
			usage,
			'should print help.'
		);
		assert.end();
	});

	test('Exported function', assert => {
		assert.throws(
			() => parseArgs(args(['-h'])).files,
			usage,
			'should print help with short argument.'
		);
		assert.end();
	});
}

sourceArgumentTests();
destinationArgumentTests();
ignoreArgumentsTest();
versionArgumentTests();
helpArgumentTests();
