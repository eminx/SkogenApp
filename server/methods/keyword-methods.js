Meteor.methods({
  getKeywords() {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      return Keywords.find().fetch();
    } catch(error) {
      throw new Meteor.Error(error);
    }
  },

  createAndAssignKeyword(data) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    
    if (!user.isPublic) {
      throw new Meteor.Error('You have to first make your profile public!');
    }

    try {
      const keywordId = Keywords.insert({
        value: data.toLowerCase(),
        assignedTo: [
          {
            userId: user._id,
            username: user.username,
            assignedDate: new Date()
          }
        ] 
      })
      
      Meteor.users.update({
        _id: user._id
      }, {
        $addToSet: {
          keywords: {
            label: data.toLowerCase(),
            id: keywordId,
            date: new Date()
          }
        }
      })
    } catch(error) {
      throw new Meteor.Error(error);
    }
  },

  assignKeyword(data) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    
    if (!user.isPublic) {
      throw new Meteor.Error('You have to first make your profile public!');
    }

    try {
      const keyword = Keywords.findOne({ value: data });
      Keywords.update({
        value: data
      }, {
        $addToSet: {
          assignedTo: {
            userId: user._id,
            username: user.username,
            assignedDate: new Date()
          }
        }
      })
      
      Meteor.users.update({
        _id: user._id
      }, {
        $addToSet: {
          keywords: {
            label: data.toLowerCase(),
            id: keyword._id,
            date: new Date()
          }
        }
      })
    } catch(error) {
      throw new Meteor.Error(error);
    }
  }
})