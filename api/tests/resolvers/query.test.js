const db = require('../../db');
const models = require('../../models');
const resolvers = require('../../resolvers');
const seedData = require('../../util/seed');

require('dotenv').config();

let data;

describe('Queries', () => {
  // Connect to the database
  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    data = await seedData();
    return data;
  });
  // Remove all records & close the db connection when all tests complete
  afterAll(async () => {
    await models.Note.deleteMany({});
    await models.User.deleteMany({});
    return db.close();
  });

  describe('notes', () => {
    test('`singleNote` should return a note', async () => {
      const note = data.notes[0];
      const result = await resolvers.Query.singleNote(
        null,
        { id: note._id },
        { models }
      );
      expect(result._id + '').toBe(note._id + '');
    });
    test('`notes` should resolve all notes in the db', async () => {
      const result = await resolvers.Query.notes(null, null, { models });
      expect(result.length).toBe(25);
    });
    test('`notefeed` should return a page of notes and metadata', async () => {
      const result = await resolvers.Query.noteFeed(
        null,
        { page: 2 },
        { models }
      );
      expect(result.notes.length).toBe(10);
      expect(result.page).toBe(2);
      expect(result.pages).toBe(3);
      expect(result.total).toBe(25);
    });
    test('`myNotes` should return the notes of the current user', async () => {
      const user = {};
      user._id = data.notes[0].author;
      const result = await resolvers.Query.myNotes(null, null, {
        models,
        user
      });
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
    test('`userFavorites` should return the favorite notes of a given user', async () => {
      const user = {};
      user._id = data.notes[0].author;
      const noteId = data.notes[0]._id;

      await models.Note.findByIdAndUpdate(noteId, {
        $push: { favoritedBy: user._id }
      });

      const result = await resolvers.Query.userFavorites(
        null,
        { id: user._id },
        { models }
      );
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
    test('`myFavorites` should return the favorite notes of the current user', async () => {
      const user = {};
      user._id = data.notes[2].author;
      const noteId = data.notes[2]._id;

      await models.Note.findByIdAndUpdate(noteId, {
        $push: { favoritedBy: user._id }
      });

      const result = await resolvers.Query.myFavorites(null, null, {
        models,
        user
      });
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('users', () => {
    test('`singleUser` should resolve a user', async () => {});
    test('`allUsers` should resolve all users in the db', async () => {
      const result = await resolvers.Query.allUsers(null, null, { models });
      expect(result.length).toBe(10);
    });
    test('`me` should resolve the current user info', async () => {
      const user = {};
      user._id = data.notes[0].author;
      const result = await resolvers.Query.me(null, null, {
        models,
        user
      });
      expect(result.name).toBeTruthy();
    });
  });
});
