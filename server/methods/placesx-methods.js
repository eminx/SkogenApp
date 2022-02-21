import { Meteor } from 'meteor/meteor';

Meteor.methods({
  getAllPlaces() {
    try {
      const places = PlacesX.find().fetch();

      const placesWithAvatars = places.map(place => {
        const user = Meteor.users.findOne(place.authorId);
        return {
          ...place,
          authorAvatar: user.avatar
        };
      });
      return placesWithAvatars;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getPlace(placeId) {
    try {
      const place = PlacesX.findOne(placeId);

      const author = Meteor.users.findOne(place.authorId);
      return {
        ...place,
        authorAvatar: author.avatar
      };
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  createPlace(values, images) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      const newPlaceId = PlacesX.insert({
        ...values,
        images,
        authorId: user._id,
        authorUsername: user.username,
        authorFirstName: user.firstName || '',
        authorLastName: user.lastName || '',
        creationDate: new Date()
      });
      return newPlaceId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  updatePlace(placeId, values, images) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      PlacesX.update(placeId, {
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

  deletePlace(placeId) {
    const user = Meteor.user();

    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    const place = PlacesX.findOne(placeId);
    if (place.authorId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      PlacesX.remove(placeId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  }
});
