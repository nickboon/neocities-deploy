const NeoCities = require('neocities');

module.exports = {
	deploy: function(username, password, files) {
		const data = files.map(file => ({
			name: file.destination,
			path: file.source
		}));

		try {
			new NeoCities(username, password).upload(data, response => {
				console.log(response.message);
				process.exit(0);
			});
		} catch (error) {
			console.log(error);
			process.exit(0);
		}
	}
};
