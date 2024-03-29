import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
const createBrowserHistory = require('history').createBrowserHistory;
import LayoutContainer from '../LayoutContainer';

// route components
import HomeContainer from './HomeContainer';

import BookingContainer from './bookings/BookingContainer';
import NewBookSpaceContainer from './bookings/NewBookSpaceContainer';
import EditBookingContainer from './bookings/EditBookingContainer';

import NewGroupContainer from './groups/NewGroupContainer';
import EditGroupContainer from './groups/EditGroupContainer';
import GroupsListContainer from './groups/GroupsListContainer';
import GroupContainer from './groups/GroupContainer';

import NewPublicationContainer from './publications/NewPublicationContainer';
import EditPublicationContainer from './publications/EditPublicationContainer';
import PublicationsListContainer from './publications/PublicationsListContainer';
import PublicationContainer from './publications/PublicationContainer';

import PageContainer from './pages/PageContainer';
import NewPageContainer from './pages/NewPageContainer';
import EditPageContainer from './pages/EditPageContainer';

import Profile from './profile/Profile';
import User from './users/User';

import UsersContainer from './admin/UsersContainer';
import Resources from './admin/Resources';
import Categories from './admin/Categories';

import Places from './places/Places';
import Place from './places/Place';
import NewPlace from './places/NewPlace';
import EditPlace from './places/EditPlace';

import DocumentsListContainer from './documents/DocumentsListContainer';

import Community from './Community';

import ScrollToTop from './ScrollToTop';
import SkogenTerms from '../UIComponents/SkogenTerms';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <LayoutContainer history={browserHistory}>
        <ScrollToTop>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/calendar" component={CalendarContainer} />

          <Route exact path="/new-booking" component={NewBookSpaceContainer} />
          <Route path="/event/:id" component={BookingContainer} />
          <Route path="/booking/:id" component={BookingContainer} />
          <Route path="/edit-booking/:id/" component={EditBookingContainer} />

          <Route exact path="/new-group" component={NewGroupContainer} />
          <Route path="/groups/" component={GroupsListContainer} />
          <Route path="/group/:id" component={GroupContainer} />
          <Route path="/edit-group/:id/" component={EditGroupContainer} />

          <Route
            exact
            path="/new-publication"
            component={NewPublicationContainer}
          />
          <Route path="/publications/" component={PublicationsListContainer} />
          <Route path="/publication/:id" component={PublicationContainer} />
          <Route
            path="/edit-publication/:id/"
            component={EditPublicationContainer}
          />

          <Route exact path="/new-page" component={NewPageContainer} />
          <Route path="/page/:id" component={PageContainer} />
          <Route path="/edit-page/:id/" component={EditPageContainer} />

          <Route
            path="/my-profile/"
            history={browserHistory}
            component={Profile}
          />

          <Route path="/documents" component={DocumentsListContainer} />

          <Route path="/admin/users" component={UsersContainer} />
          <Route path="/admin/resources" component={Resources} />
          <Route path="/admin/categories" component={Categories} />

          <Route exact path="/@:username" component={User} />

          <Route path="/places" component={Places} />
          <Route exact path="/place/:id" component={Place} />
          <Route path="/edit-place/:id" component={EditPlace} />
          <Route path="/new-place" component={NewPlace} />

          {/* <Route path="/works" component={Works} />
          <Route exact path="/:username/work/:id" component={Work} />
          <Route path="/:username/edit-work/:id" component={EditWork} />
          <Route path="/new-work" component={NewWork} /> */}

          <Route path="/community" component={Community} />

          <Route path="/terms" component={SkogenTerms} />
        </ScrollToTop>
      </LayoutContainer>
    </Switch>
  </Router>
);
