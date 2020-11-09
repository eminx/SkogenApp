export const getRoomIndex = room => {
  const thePlace = Places.findOne({ name: room });
  console.log(Places.find().fetch());
  return thePlace.roomIndex;
};

export const siteUrl = Meteor.absoluteUrl();
