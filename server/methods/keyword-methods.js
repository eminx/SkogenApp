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

    if (Keywords.findOne({value: data.toLowerCase()})) {
      throw new Meteor.Error('Keyword exists');
    } else if (!user.keywords) {
      return;
    } else if (user.keywords.find(k => k.label === data.toLowerCase())) {
      throw new Meteor.Error('You already have this keyword');
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

    if (user.keywords.find(k => k.label === data.toLowerCase())) {
      throw new Meteor.Error('You already have assigned this keyword.');
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
  },

  removeKeyword(data) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    
    if (!user.isPublic) {
      throw new Meteor.Error('You have to first make your profile public!');
    }

    if (!user.keywords.find(k => k.label === data.label.toLowerCase())) {
      throw new Meteor.Error('You do not seem to hold this keyword anyways.');
    }

    try {
      const filteredKeywords = user.keywords.filter(k => k.label !== data.label)
      
      Keywords.update({
        value: data.label
      }, {
        $pull: {
          assignedTo: {
            username: user.username,
          }
        }
      })

      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          keywords: filteredKeywords
        }
      })
    } catch(error) {
      throw new Meteor.Error(error);
    }
  }
})