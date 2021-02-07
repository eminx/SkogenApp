Meteor.publishLite('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publishLite('gatherings', function (onlyPublic = false) {
  const fields = {
    title: 1,
    datesAndTimes: 1,
    roomIndex: 1,
    room: 1,
    place: 1,
    isPublicActivity: 1,
    authorName: 1,
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

Meteor.publishLite('groups', function () {
  const userId = Meteor.userId();

  const fields = {
    title: 1,
    readingMaterial: 1,
    imageUrl: 1,
    meetings: 1,
    adminUsername: 1,
    adminId: 1,
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

Meteor.publishLite('manuals', function () {
  return Documents.find({
    contextType: 'manual',
  });
});

Meteor.publishLite('publications', function () {
  return Publications.find(
    {
      isPublished: true,
    },
    { sort: { creationDate: 1 } }
  );
  // }
});

Meteor.publishLite('gathering', function (id) {
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

Meteor.publishLite('group', function (id) {
  return Groups.find({
    _id: id,
  });
});

Meteor.publishLite('publication', function (id) {
  return Publications.find({
    _id: id,
  });
});

Meteor.publishLite('pages', function () {
  return Pages.find({}, { sort: { creationDate: 1 } });
});

Meteor.publishLite('page', function (title) {
  return Pages.find({ title });
});

Meteor.publishLite('work', function (id) {
  return Works.find({
    _id: id,
  });
});

Meteor.publishLite('works', function () {
  return Works.find({}, { sort: { creationDate: 1 } });
});

Meteor.publishLite('myworks', function () {
  const currentUserId = Meteor.userId();
  return Works.find(
    {
      authorId: currentUserId,
    },
    { sort: { creationDate: 1 } }
  );
});

Meteor.publishLite('chat', function (contextId) {
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publishLite('places', function () {
  return Places.find({}, { sort: { roomIndex: 1 } });
});

Meteor.publishLite('documents', function () {
  return Documents.find();
});

Meteor.publishLite('users', function () {
  const user = Meteor.user();
  if (!user || !user.isSuperAdmin) {
    return null;
  }
  return Meteor.users.find();
});

Meteor.publishLite('me', function () {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});
