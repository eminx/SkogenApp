import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const swSupported = 'serviceWorker' in navigator;
  if (!swSupported) {
    return;
  }
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.info('service worker registered'))
    .catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
});
