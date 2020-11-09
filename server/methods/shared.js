export const getRoomIndex = room => {
  const thePlace = Places.findOne({ name: room });
  return thePlace.roomIndex;
};

export const siteUrl = Meteor.absoluteUrl();
