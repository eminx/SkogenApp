import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import Chattery from '../../chattery';
import FancyDate from '../../UIComponents/FancyDate';

import {
  Row,
  Col,
  Button,
  Divider,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
} from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import CaretRightOutlined from '@ant-design/icons/lib/icons/CaretRightOutlined';

import CardArticle from '../../UIComponents/CardArticle';
import Loader from '../../UIComponents/Loader';

const Panel = Collapse.Panel;
const FormItem = Form.Item;

function registrationSuccess() {
  Modal.success({
    title: 'You are set!',
    content: 'You have just successfully registered your attendance. Welcome!',
  });
}

function registrationAlreadyMade() {
  Modal.error({
    title: 'You have already registered!',
    content:
      'You have already made a registration with the same email address and last name. Please click "Change/Cancel Existing RSVP" and proceed to change your registration.',
  });
}

function capacityExceedsError(capacityLeft) {
  Modal.error({
    title: 'Not enough seats',
    content: `Unfortunately there are not sufficient seats left to host your entire party. There ${
      capacityLeft === 1 ? 'is' : 'are'
    } only ${capacityLeft} seat${
      capacityLeft === 1 ? '' : 's'
    } left. Please make your booking accordingly.`,
  });
}

class Booking extends React.Component {
  state = {
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
    capacityGotFullByYou: false,
  };

  addNewChatMessage = (message) => {
    Meteor.call(
      'addChatMessage',
      this.props.bookingData._id,
      message,
      'booking',
      (error, respond) => {
        if (error) {
          console.log('error', error);
        }
      }
    );
  };

  getChatMessages = () => {
    const { chatData, currentUser } = this.props;
    if (!currentUser) {
      return [];
    }

    let messages = [];
    if (chatData) {
      messages = [...chatData.messages];
      messages.forEach((message) => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  };

  handleRSVPSubmit = (values, occurenceIndex) => {
    const { bookingData } = this.props;
    let isAlreadyRegistered = false;
    const occurence = bookingData.datesAndTimes[occurenceIndex];
    occurence.attendees.forEach((attendee, attendeeIndex) => {
      if (
        attendee.lastName === values.lastName &&
        attendee.email === values.email
      ) {
        registrationAlreadyMade();
        isAlreadyRegistered = true;
        return;
      }
    });
    if (isAlreadyRegistered) {
      return;
    }

    let registeredNumberOfAttendees = 0;
    occurence.attendees.forEach((attendee) => {
      registeredNumberOfAttendees += attendee.numberOfPeople;
    });

    if (
      occurence.capacity <
      registeredNumberOfAttendees + values.numberOfPeople
    ) {
      const capacityLeft = occurence.capacity - registeredNumberOfAttendees;
      capacityExceedsError(capacityLeft);
      return;
    }

    Meteor.call(
      'registerAttendance',
      bookingData._id,
      values,
      occurenceIndex,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
          return;
        }
        registrationSuccess();
      }
    );
  };

  openCancelRsvpModal = (occurenceIndex) => {
    const { currentUser } = this.props;

    this.setState({
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName:
          currentUser && currentUser.lastName ? currentUser.lastName : '',
      },
    });
  };

  findRsvpInfo = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;
    const theOccurence =
      bookingData.datesAndTimes[rsvpCancelModalInfo.occurenceIndex];

    const attendeeFinder = (attendee) =>
      attendee.lastName === rsvpCancelModalInfo.lastName &&
      attendee.email === rsvpCancelModalInfo.email;

    const foundAttendee = theOccurence.attendees.find(attendeeFinder);
    const foundAttendeeIndex = theOccurence.attendees.findIndex(attendeeFinder);

    if (!foundAttendee) {
      message.error(
        'Sorry we could not find your registration. Please double check the date and spellings, and try again'
      );
      return;
    }

    this.setState({
      rsvpCancelModalInfo: {
        ...rsvpCancelModalInfo,
        attendeeIndex: foundAttendeeIndex,
        isInfoFound: true,
        firstName: foundAttendee.firstName,
        numberOfPeople: foundAttendee.numberOfPeople,
      },
    });
  };

  renderCancelRsvpModalContent = () => {
    const { rsvpCancelModalInfo } = this.state;
    if (!rsvpCancelModalInfo) {
      return;
    }

    if (rsvpCancelModalInfo.isInfoFound) {
      const user = {
        ...rsvpCancelModalInfo,
        emails: [{ address: rsvpCancelModalInfo.email }],
      };
      return (
        <RsvpForm
          isUpdateMode
          handleDelete={this.handleRemoveRSVP}
          currentUser={user}
          handleSubmit={(event) => this.handleChangeRSVPSubmit(event)}
        />
      );
    } else {
      return (
        <div>
          <Input
            placeholder="Last name"
            style={{ marginBottom: 24 }}
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  lastName: e.target.value,
                },
              })
            }
          />
          <Input
            placeholder="Email"
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  email: e.target.value,
                },
              })
            }
          />
        </div>
      );
    }
  };

  handleChangeRSVPSubmit = (fieldsValue) => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;

    Meteor.call(
      'updateAttendance',
      bookingData._id,
      fieldsValue,
      rsvpCancelModalInfo.occurenceIndex,
      rsvpCancelModalInfo.attendeeIndex,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
          return;
        }
        message.success('You have successfully updated your RSVP');
        this.setState({
          rsvpCancelModalInfo: null,
          isRsvpCancelModalOn: false,
        });
      }
    );
  };

  handleRemoveRSVP = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { bookingData } = this.props;

    Meteor.call(
      'removeAttendance',
      bookingData._id,
      rsvpCancelModalInfo.occurenceIndex,
      rsvpCancelModalInfo.attendeeIndex,
      rsvpCancelModalInfo.email,
      (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
        } else {
          message.success('You have successfully removed your RSVP');
          this.setState({
            rsvpCancelModalInfo: null,
            isRsvpCancelModalOn: false,
          });
        }
      }
    );
  };

  renderDates = () => {
    const { bookingData, currentUser } = this.props;
    const { capacityGotFullByYou } = this.state;

    if (!bookingData) {
      return;
    }

    const isRegisteredMember = this.isRegisteredMember();

    const customPanelStyle = {
      width: '100%',
      marginBottom: 12,
      borderRadius: 4,
      border: '1px solid #921bef',
      background: '#fff',
      overflow: 'hidden',
    };

    const yesterday = moment(new Date()).add(-1, 'days');

    if (bookingData.isBookingsDisabled) {
      return (
        <div>
          {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
            <div style={{ ...customPanelStyle, padding: 12 }}>
              <FancyDate occurence={occurence} />
            </div>
          ))}
        </div>
      );
    }

    const getTotalNumber = (occurence) => {
      let counter = 0;
      occurence.attendees.forEach((attendee) => {
        counter += attendee.numberOfPeople;
      });
      return counter;
    };

    const conditionalRender = (occurence, occurenceIndex) => {
      if (occurence && occurence.attendees) {
        const eventPast = moment(occurence.endDate).isBefore(yesterday);

        return (
          <div>
            {eventPast ? (
              <p>This event has past</p>
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 12,
                  }}
                >
                  <a onClick={() => this.openCancelRsvpModal(occurenceIndex)}>
                    Change/Cancel Existing RSVP
                  </a>
                </div>
                {occurence.capacity &&
                occurence.attendees &&
                getTotalNumber(occurence) >= occurence.capacity ? (
                  <p>
                    {capacityGotFullByYou &&
                      'Congrats! You just filled the last space!'}
                    Capacity is full now.
                  </p>
                ) : (
                  <RsvpForm
                    currentUser={currentUser}
                    handleSubmit={(values) =>
                      this.handleRSVPSubmit(values, occurenceIndex)
                    }
                  />
                )}
              </div>
            )}
            {isRegisteredMember && (
              <div style={{ paddingLeft: 12 }}>
                <Divider />
                <h4>Attendees</h4>
                <span>Only visible to registered Skogen members</span>
                <div
                  style={{
                    paddingBottom: 12,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ReactToPrint
                    trigger={() => <Button>Print</Button>}
                    content={() => this.printableElement}
                    pageStyle={{ margin: 144 }}
                  />
                </div>
                <RsvpList
                  attendees={occurence.attendees}
                  ref={(element) => (this.printableElement = element)}
                />
              </div>
            )}
          </div>
        );
      }
    };

    return (
      <Collapse
        bordered={false}
        accordion
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        {bookingData.datesAndTimes.map((occurence, occurenceIndex) => (
          <Panel
            key={occurence.startDate + occurence.startTime}
            header={<FancyDate occurence={occurence} />}
            style={{ ...customPanelStyle }}
          >
            {conditionalRender(occurence, occurenceIndex)}
          </Panel>
        ))}
      </Collapse>
    );
  };

  isAdmin = () => {
    const { currentUser, bookingData } = this.props;
    return (
      currentUser && bookingData && currentUser._id === bookingData.authorId
    );
  };

  isRegisteredMember = () => {
    const { currentUser } = this.props;
    return currentUser && currentUser.isRegisteredMember;
  };

  removeNotification = (messageIndex) => {
    const { bookingData, currentUser } = this.props;
    const shouldRun = currentUser.notifications.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some((unSeenIndex) => {
        return unSeenIndex === messageIndex;
      });
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call(
      'removeNotification',
      bookingData._id,
      messageIndex,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.error);
        }
      }
    );
  };

  render() {
    const { bookingData, isLoading, currentUser, chatData } = this.props;
    const { isRsvpCancelModalOn, rsvpCancelModalInfo } = this.state;

    const messages = this.getChatMessages();
    const isRegisteredMember = this.isRegisteredMember();

    return (
      <div style={{ padding: 24 }}>
        <div style={{ paddingBottom: 24 }}>
          <Link to="/">
            <Button icon={<LeftOutlined />}>Program</Button>
          </Link>
        </div>

        {!isLoading && bookingData ? (
          <Row gutter={24}>
            <Col md={24} lg={5}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 0 }}>{bookingData.title}</h2>
                {bookingData.subTitle && (
                  <h4 style={{ fontWeight: 300 }}>{bookingData.subTitle}</h4>
                )}
              </div>
            </Col>

            <Col
              md={24}
              lg={12}
              style={{ position: 'relative', marginBottom: 24 }}
            >
              <CardArticle
                item={bookingData}
                isLoading={isLoading}
                currentUser={currentUser}
              />
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={7}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ width: '100%' }}>
                <h3>Dates</h3>
                <p>
                  {bookingData.isBookingsDisabled
                    ? 'Bookings are disabled. Please check the practical information.'
                    : 'Please click and open the date to RSVP'}
                </p>
                {this.renderDates()}
              </div>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}

        <Row justify="center">
          <Divider />
          {currentUser &&
            bookingData &&
            (currentUser._id === bookingData.authorId ||
              currentUser.isSuperAdmin) && (
              <Link to={`/edit-booking/${bookingData._id}`}>
                <Button>Edit</Button>
              </Link>
            )}
        </Row>
        <Divider />

        {bookingData &&
          bookingData.isPublicActivity &&
          messages &&
          isRegisteredMember && (
            <Row gutter={24}>
              <Col md={0} lg={5} />
              <Col xs={24} sm={24} md={24} lg={11}>
                {chatData && (
                  <div>
                    <h2>Chat Section</h2>
                    <Chattery
                      messages={messages}
                      onNewMessage={this.addNewChatMessage}
                      removeNotification={this.removeNotification}
                      isMember
                    />
                  </div>
                )}
              </Col>
            </Row>
          )}

        <Modal
          title={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
              ? 'Now please continue'
              : 'Please enter the details of your RSVP'
          }
          footer={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound && null
          }
          visible={isRsvpCancelModalOn}
          onOk={this.findRsvpInfo}
          onCancel={() => this.setState({ isRsvpCancelModalOn: false })}
        >
          {this.renderCancelRsvpModalContent()}
        </Modal>
      </div>
    );
  }
}

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

const RsvpForm = (props) => {
  const { isUpdateMode, handleSubmit, handleDelete } = props;

  const layout = {
    wrapperCol: { span: 24 },
  };
  return (
    <Form {...layout} onFinish={handleSubmit} style={{ paddingLeft: 12 }}>
      <FormItem
        name="firstName"
        rules={[{ required: true, message: 'Please enter your first name' }]}
        initialValue={props.currentUser && props.currentUser.firstName}
      >
        <Input placeholder="First name" />
      </FormItem>
      <FormItem
        name="lastName"
        rules={[{ required: true, message: 'Please enter your last name' }]}
        initialValue={props.currentUser && props.currentUser.lastName}
      >
        <Input placeholder="Last name" />
      </FormItem>
      <FormItem
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email address',
          },
        ]}
        initialValue={props.currentUser && props.currentUser.emails[0].address}
      >
        <Input placeholder="Email addresss" />
      </FormItem>
      <FormItem
        name="numberOfPeople"
        rules={[
          {
            required: true,
            message: 'Please enter the number of people in your party',
          },
        ]}
        initialValue={
          (props.currentUser && props.currentUser.numberOfPeople) || 1
        }
        style={{ width: '100%' }}
      >
        <InputNumber min={1} max={20} placeholder="Number of people" />
      </FormItem>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <Button type="primary" htmlType="submit">
          {isUpdateMode ? 'Update' : 'Register'}
        </Button>

        {isUpdateMode && <a onClick={handleDelete}>Remove your registration</a>}
      </div>
    </Form>
  );
};

class RsvpList extends React.PureComponent {
  render() {
    const { attendees } = this.props;

    return (
      <ReactTable
        data={attendees}
        columns={[
          {
            Header: 'First name',
            accessor: 'firstName',
          },
          {
            Header: 'Last name',
            accessor: 'lastName',
          },
          {
            Header: 'People',
            accessor: 'numberOfPeople',
          },
          {
            Header: 'Email',
            accessor: 'email',
          },
        ]}
      />
    );
  }
}

export default Booking;
