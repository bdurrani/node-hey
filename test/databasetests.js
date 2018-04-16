const should = require('should');
const { Database, DatabaseUtils } = require('../database');

describe('database library tests', () => {
	let _database;
	before(async() => {
		_database = new Database(true);
		await _database.init();
	});

	after(() => {
		_database.close();
	});

	beforeEach(async() => {
		await _database.clearAll();
	});

	afterEach(() => {
	});

	it('list interruptions for the day', async() => {
		const firstUser = 'bilal';
		const secondUser = 'tim';
		let interruptions = [];
		interruptions.push(_database.addInterruption([firstUser]));
		interruptions.push(_database.addInterruption([secondUser]));
		await DatabaseUtils.all(interruptions);
		interruptions = [];
		interruptions.push(_database.listInterruptions());
		interruptions.push(DatabaseUtils.dumpData(_database));
		const results = await DatabaseUtils.all(interruptions);
		const todaysInterruptions = results[0];
		const dbDump = results[1];
		todaysInterruptions.should.have.length(2);
		dbDump.should.have.length(2);
	});

	it('save interruption', async() => {
		const username = 'bilal';
		await _database.addInterruption([username]);
		const result = await DatabaseUtils.dumpData(_database);
		result.should.have.length(1);
		validateSingleUserWithoutCommandsOrTags(result[0], username, 1);
	});

	function validateSingleUserWithoutCommandsOrTags(entry, username, id) {
		entry.id.should.be.exactly(id);
		entry.who.should.be.an.Array();
		entry.who.should.containDeepOrdered([username]);
		should(entry.tags).be.null();
		should(entry.comment).be.null();
	}
});
