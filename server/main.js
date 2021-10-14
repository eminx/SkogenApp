import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL =
    'smtps://' +
    encodeURIComponent(smtp.userName) +
    ':' +
    smtp.password +
    '@' +
    smtp.host +
    ':' +
    smtp.port;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;

  Gatherings._ensureIndex({ isPublished: 1 });
  Groups._ensureIndex({ isPublished: 1 });
  Pages._ensureIndex({ isPublished: 1 });
  Publications._ensureIndex({
    isPublished: 1,
  });
  Places._ensureIndex({ isPublished: 1 });

  Meteor.users.find().forEach(user => {
    if (!user.keywords) {
      Meteor.users.update({
        _id: user._id
      }, {
        $set: {
          keywords: []
        }
      })
    }
  })
});
