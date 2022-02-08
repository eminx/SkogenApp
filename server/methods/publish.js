Meteor.publish('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publish('gatherings', function (onlyPublic = false) {
  const fields = {
    authorName: 1,
    datesAndTimes: 1,
    isPublicActivity: 1,
    longDescription: 1,
    place: 1,
    room: 1,
    roomIndex: 1,
    title: 1,
  };

  const publicFields = {
    title: 1,
    subTitle: 1,
    imageUrl: 1,
    datesAndTimes: 1,
    isPublicActivity: 1,
  };

  if (onlyPublic) {
    return Gatherings.find(
      {
        isPublicActivity: true,
      },
      { fields: publicFields }
    );
  } else {
    return Gatherings.find({}, { fields });
  }
});

Meteor.publish('groups', function () {
  const userId = Meteor.userId();

  const fields = {
    title: 1,
    readingMaterial: 1,
    imageUrl: 1,
    meetings: 1,
    adminUsername: 1,
    adminId: 1,
    isPrivate: 1,
  };
  if (userId) {
    (fields.members = 1), (fields.peopleInvited = 1);
  }

  return Groups.find(
    {
      isPublished: true,
    },
    {
      fields,
      sort: { creationDate: 1 },
    }
  );
});

Meteor.publish('manuals', function () {
  return Documents.find({
    contextType: 'manual',
  });
});

Meteor.publish('publications', function () {
  return Publications.find(
    {
      isPublished: true,
    },
    { sort: { creationDate: 1 } }
  );
  // }
});

Meteor.publish('gathering', function (id) {
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Gatherings.find({
      _id: id,
    });
  } else if (user) {
    return Gatherings.find({
      _id: id,
      $or: [
        {
          isPublished: true,
        },
        {
          authorId: user._id,
        },
      ],
    });
  } else {
    return Gatherings.find({
      _id: id,
      isPublished: true,
    });
  }
});

Meteor.publish('group', function (id) {
  return Groups.find({
    _id: id,
  });
});

Meteor.publish('publication', function (id) {
  return Publications.find({
    _id: id,
  });
});

Meteor.publish('pages', function () {
  return Pages.find({}, { sort: { creationDate: 1 } });
});

Meteor.publish('page', function (title) {
  return Pages.find({ title });
});

Meteor.publish('work', function (id) {
  return Works.find({
    _id: id,
  });
});

Meteor.publish('works', function () {
  return Works.find({}, { sort: { creationDate: 1 } });
});

Meteor.publish('myworks', function () {
  const currentUserId = Meteor.userId();
  return Works.find(
    {
      authorId: currentUserId,
    },
    { sort: { creationDate: 1 } }
  );
});

Meteor.publish('chat', function (contextId) {
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publish('places', function () {
  return Places.find({}, { sort: { roomIndex: 1 } });
});

Meteor.publish('documents', function () {
  return Documents.find();
});

Meteor.publish('users', function () {
  const user = Meteor.user();
  if (!user || !user.isSuperAdmin) {
    return null;
  }
  return Meteor.users.find({}, {
    fields: {
      avatar: 1,
      contactInfo: 1,
      createdAt: 1,
      emails: 1,
      firstName: 1,
      forCommunity: 1,
      interestedIn: 1,
      isRegisteredMember: 1,
      lastName: 1,
      meAndSkogen: 1,
      username: 1,
    },
  });
});

Meteor.publish('me', function () {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});

Meteor.publish('user', function (username) {
  return Meteor.users.find({
    username, 
    isPublic: true 
  }, {
    fields: {
      avatar: 1,
      contactInfo: 1,
      firstName: 1,
      forCommunity: 1,
      images: 1,
      interestedIn: 1,
      lastName: 1,
      skogenAndMe: 1,
      username: 1,
    },
  });
});

Meteor.publish('userWorks', function (username) {
  return Works.find({
    authorUsername: username,
  });
});
