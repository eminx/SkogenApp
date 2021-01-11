export const getRoomIndex = (room) => {
  const thePlace = Places.findOne({ name: room });
  if (!thePlace) {
    return null;
  }
  return thePlace.roomIndex;
};

export const siteUrl = Meteor.absoluteUrl();
