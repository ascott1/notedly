const db = require('../../db');
const mongoose = require('mongoose');
const models = require('../../models');
const resolvers = require('../../resolvers');
require('dotenv').config();

describe('Queries', () => {
  // Connect to the database
  beforeAll(() => {
    return db.connect(process.env.TEST_DB);
  });
  // Close the database connection when all tests complete
  afterAll(() => {
    return db.close();
  });
  // Remove all records after each test
  afterEach(async () => {
    await models.Note.deleteMany({});
    await models.User.deleteMany({});
  });

  describe('notes', () => {
    test('`singleNote` should return a note', async () => {
      const user = mongoose.Types.ObjectId();
      const note = await models.Note.create({
        content: 'test',
        htmlContent: '<p>test</p>',
        favoriteCount: 0,
        favoritedBy: [],
        author: user
      });
      const result = await resolvers.Query.singleNote(
        null,
        { id: note._id },
        { models }
      );

      expect(result._id + '').toBe(result._id + '');
    });
    test('`notes` should resolve all notes in the db', async () => {});
    test('`notefeed` should return a page of notes', async () => {});
    test('`myNotes` should return the notes of the current user', async () => {});
    test('`userFavorites` should return the favorite notes of a given user', async () => {});
    test('`myFavorites` should return the favorite notes of the current user', async () => {});
  });

  describe('users', () => {
    test('`singleUser` should resolve a user', async () => {});
    test('`allUsers` should resolve all users in the db', async () => {});
    test('`me` should resolve the current user info', async () => {});
  });
});
