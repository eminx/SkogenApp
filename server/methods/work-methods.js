import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getWork(workId, username) {
    try {
      const work = Works.findOne(workId);
      if (work.authorUsername !== username) {
        throw new Meteor.Error('Not allowed!');
      }
      return work;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getAllWorks() {
    try {
      const works = Works.find().fetch();

      const worksWithAvatars = works.map(work => {
        const user = Meteor.users.findOne(work.authorId);
        return {
          ...work,
          authorAvatar: user.avatar
        };
      });
      return worksWithAvatars;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getWork(workId, username) {
    try {
      const work = Works.findOne(workId);
      if (work.authorUsername !== username) {
        throw new Meteor.Error('Not allowed!');
      }
      const author = Meteor.users.findOne(work.authorId);
      return {
        ...work,
        authorAvatar: author.avatar
      };
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  createWork(values, images) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      const newWorkId = Works.insert({
        ...values,
        images,
        authorId: user._id,
        authorUsername: user.username,
        authorFirstName: user.firstName || '',
        authorLastName: user.lastName || '',
        creationDate: new Date()
      });
      return newWorkId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  updateWork(workId, values, images) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Works.update(workId, {
        $set: {
          ...values,
          images,
          latestUpdate: new Date()
        }
      });
      return values.title;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deleteWork(workId) {
    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    const work = Works.findOne(workId);
    if (work.authorId !== userId) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Works.remove(workId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  }
});
