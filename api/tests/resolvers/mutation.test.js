const mongoose = require('mongoose');

const db = require('../../db');
const models = require('../../models');
const resolvers = require('../../resolvers');

require('dotenv').config();

// A note owner user
const user = {
  _id: mongoose.Types.ObjectId(),
  name: 'Adam Scott',
  userName: '',
  providerId: '0110100001101001',
  provider: 'github',
  email: 'email@example.com',
  avatar: 'https://example.com/avatar.png'
};

const badUser = {
  _id: mongoose.Types.ObjectId()
};

// A note to perform mutations with
const note = {
  content: 'Hello!',
  htmlContent: '<p>Hello!</p>',
  favoriteCount: 0,
  favoritedBy: [],
  author: user._id
};

describe('Mutations', () => {
  // Connect to the database
  beforeAll(async () => {
    return db.connect(process.env.TEST_DB);
  });

  // Clear the DB after each test
  afterEach(async () => {
    await models.Note.deleteMany({});
    await models.User.deleteMany({});
  });

  // Close the db connection when all tests complete
  afterAll(async () => {
    return db.close();
  });

  describe('note mutations', () => {
    test('`newNote` should resolve a note', async () => {
      const result = await resolvers.Mutation.newNote(
        null,
        { content: 'Hello!' },
        { models, user }
      );
      expect(result.content).toBe('Hello!');
    });
    test('`updateNote` should resolve an updated note', async () => {
      // add a note to the db
      const temp = await models.Note.create(note);
      const result = await resolvers.Mutation.updateNote(
        null,
        { content: 'Hello World!', id: temp._id },
        { models, user }
      );
      expect(result.content).toBe('Hello World!');
    });
    test('`deleteNote` should resolve true if note is deleted', async () => {
      const temp = await models.Note.create(note);
      const result = await resolvers.Mutation.deleteNote(
        null,
        { id: temp._id },
        { models, user }
      );
      expect(result).toBe(true);
    });
    test('`toggleFavorites` should resolve a new new favorite', async () => {
      const temp = await models.Note.create(note);
      const result = await resolvers.Mutation.toggleFavorite(
        null,
        { id: temp._id },
        { models, user }
      );
      expect(result.favoriteCount).toBe(1);
      expect(result.favoritedBy.length).toBe(1);
    });
    test('`toggleFavorites` should remove a favorite', async () => {
      note.favoriteCount = 1;
      note.favoritedBy = [user._id];
      const temp = await models.Note.create(note);
      const result = await resolvers.Mutation.toggleFavorite(
        null,
        { id: temp._id },
        { models, user }
      );
      expect(result.favoriteCount).toBe(0);
      expect(result.favoritedBy.length).toBe(0);
    });
  });
  describe('note errors', () => {
    test('`newNote` should throw an error if user is not signed in', async () => {
      await expect(
        resolvers.Mutation.newNote(null, { content: 'Hello!' }, { models })
      ).rejects.toThrow();
    });
    test('`updateNote` should throw an error if user is not the note owner', async () => {
      // add a note to the db
      const temp = await models.Note.create(note);
      await expect(
        resolvers.Mutation.updateNote(
          null,
          { content: 'Hello World!', id: temp._id },
          { models, badUser }
        )
      ).rejects.toThrow();
    });
    test('`deleteNote` should throw an error if user is not the note owner', async () => {
      const temp = await models.Note.create(note);
      await expect(
        resolvers.Mutation.updateNote(
          null,
          { id: temp._id },
          { models, badUser }
        )
      ).rejects.toThrow();
    });
    test('`toggleFavorites` should throw an error if user is not signed in', async () => {
      const temp = await models.Note.create(note);
      await expect(
        resolvers.Mutation.toggleFavorite(null, { id: temp._id }, { models })
      ).rejects.toThrow();
    });
  });
});
