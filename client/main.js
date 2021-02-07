import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { render } from 'react-dom';

import { renderRoutes } from './RouterComponents/routes';
import './serviceWorker.js';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

Meteor.startup(() => {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
  });
  render(renderRoutes(), document.getElementById('render-target'));
});
