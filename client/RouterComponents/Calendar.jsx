import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import {
  Row,
  Col,
  Card,
  Divider,
  Tag,
  Button,
  Modal,
  Spin,
  message,
} from 'antd';
import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import NiceList from '../UIComponents/NiceList';
import colors from '../constants/colors';

const yesterday = moment(new Date()).add(-1, 'days');

class Calendar extends React.PureComponent {
  state = {
    mode: 'list',
    editBooking: null,
    calendarFilter: 'All rooms',
    selectedBooking: null,
  };

  handleModeChange = (e) => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  handleSelectBooking = (booking, e) => {
    e.preventDefault();
    this.setState({
      selectedBooking: booking,
    });
  };

  handleCalendarFilterChange = (value) => {
    this.setState({
      calendarFilter: value,
    });
  };

  handleCloseModal = () => {
    this.setState({
      selectedBooking: null,
    });
  };

  handleEditBooking = () => {
    this.setState({
      editBooking: true,
    });
  };

  getBookingTimes = (booking) => {
    if (!booking) {
      return '';
    }
    if (booking.startDate === booking.endDate) {
      return `${booking.startTime}–${booking.endTime} ${moment(
        booking.startDate
      ).format('DD MMMM')}`;
    }
    return (
      moment(booking.startDate).format('DD MMM') +
      ' ' +
      booking.startTime +
      ' – ' +
      moment(booking.endDate).format('DD MMM') +
      ' ' +
      booking.endTime
    );
  };

  isCreatorOrAdmin = () => {
    const { currentUser } = this.props;
    const { selectedBooking } = this.state;

    if (!selectedBooking || !currentUser) {
      return false;
    }

    if (
      selectedBooking &&
      currentUser &&
      (currentUser.username === selectedBooking.authorName ||
        currentUser.isSuperAdmin)
    ) {
      return true;
    }
  };

  handleDropDocument = (files) => {
    const { currentUser } = this.props;
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('groupDocumentUpload');
    files.forEach((file) => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type,
      });
      upload.send(uploadableFile, (error, downloadUrl) => {
        if (error) {
          message.error(error.reason);
          closeLoader();
          return;
        } else {
          Meteor.call(
            'createDocument',
            uploadableFile.name,
            downloadUrl,
            'manual',
            currentUser.username,
            (error, respond) => {
              if (error) {
                message.error(error);
                closeLoader();
              } else {
                message.success(
                  `${uploadableFile.name} is succesfully uploaded and assigned to manuals!`
                );
                closeLoader();
              }
            }
          );
        }
      });
    });
  };

  removeManual = (documentId) => {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.isSuperAdmin) {
      return;
    }
    Meteor.call('removeManual', documentId, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.destroy();
        message.error(error.error);
      } else {
        message.success('The manual is successfully removed');
      }
    });
  };

  render() {
    const { isLoading, currentUser, placesList, allActivities, manuals } =
      this.props;
    const { editBooking, calendarFilter, selectedBooking, isUploading } =
      this.state;

    const futureBookings = [];

    allActivities.filter((booking) => {
      if (moment(booking.endDate).isAfter(yesterday)) {
        futureBookings.push(booking);
      }
    });

    let filteredBookings = allActivities;

    if (calendarFilter !== 'All rooms') {
      filteredBookings = allActivities.filter(
        (booking) => booking.room === calendarFilter
      );
    }

    if (editBooking) {
      return <Redirect to={`/edit-booking/${selectedBooking._id}`} />;
    }

    const isSuperAdmin = currentUser && currentUser.isSuperAdmin;

    const manualsList = manuals.map((manual) => ({
      ...manual,
      actions: [
        {
          content: 'Remove',
          handleClick: () => this.removeManual(manual._id),
        },
      ],
    }));

    return (
      <div style={{ padding: 12 }}>
        {currentUser && currentUser.isRegisteredMember && (
          <Row justify="center" style={{ paddingBottom: 12 }}>
            <Link to="/new-booking">
              <Button>New Booking</Button>
            </Link>
          </Row>
        )}

        <Row gutter={24} justify="center">
          <Spin
            spinning={isLoading}
            tip="loading all bookings..."
            wrapperClassName="spin-container"
          >
            <div style={{ width: '100%' }}>
              <div
                className="tags-container"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Tag.CheckableTag
                  checked={calendarFilter === 'All rooms'}
                  onChange={() => this.handleCalendarFilterChange('All rooms')}
                  key={'All rooms'}
                >
                  {'All rooms'}
                </Tag.CheckableTag>
                {placesList.map((room, i) => (
                  <Tag
                    color={colors[i]}
                    className={calendarFilter === room.name ? 'checked' : null}
                    onClick={() => this.handleCalendarFilterChange(room.name)}
                    key={room.name}
                  >
                    {room.name}
                  </Tag>
                ))}
              </div>

              <CalendarView
                bookings={filteredBookings}
                onSelect={this.handleSelectBooking}
              />
            </div>
          </Spin>
        </Row>

        <Divider />

        <h3 style={{ textAlign: 'center' }}>Skogen Manuals</h3>
        <Row justify="center">
          <Col md={8}>
            {isSuperAdmin && (
              <ReactDropzone onDrop={this.handleDropDocument}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      width: '100%',
                      height: 200,
                      background: isDragActive ? '#921bef' : '#fff5f4cc',
                      padding: 24,
                      border: '1px dashed #921bef',
                      textAlign: 'center',
                    }}
                  >
                    {isUploading ? (
                      <div>
                        <Loader />
                        uploading
                      </div>
                    ) : (
                      <div>
                        <b>Drop documents to upload</b>
                      </div>
                    )}
                    <input {...getInputProps()} />
                  </div>
                )}
              </ReactDropzone>
            )}
          </Col>
          <Col md={16} style={{ paddingLeft: 12, paddingRight: 12 }}>
            {manuals && manuals.length > 0 && (
              <NiceList list={manualsList} actionsDisabled={!isSuperAdmin}>
                {(manual) => (
                  <Card
                    key={manual.documentLabel}
                    title={
                      <h4>
                        <a href={manual.documentUrl} target="_blank">
                          {manual.documentLabel}
                        </a>
                      </h4>
                    }
                    bordered={false}
                    style={{ width: '100%', marginBottom: 0 }}
                    className="empty-card-body"
                  />
                )}
              </NiceList>
            )}
          </Col>
        </Row>

        <Divider />

        <h3 style={{ textAlign: 'center' }}>Resources</h3>
        <Row justify="center">
          {placesList.map((resource, index) => (
            <Card
              key={resource._id}
              size="small"
              title={<h3>{resource.name}</h3>}
              style={{ width: 300, margin: 12 }}
            >
              <p>{resource.description}</p>
            </Card>
          ))}
        </Row>

        <Modal
          visible={Boolean(selectedBooking)}
          okText="Edit"
          cancelText="Close"
          okButtonProps={
            (!this.isCreatorOrAdmin() || selectedBooking.isGroup) && {
              style: { display: 'none' },
            }
          }
          onOk={this.handleEditBooking}
          onCancel={this.handleCloseModal}
          title={
            <div>
              <h2>{selectedBooking && selectedBooking.title}</h2>{' '}
              <h4>{this.getBookingTimes(selectedBooking)}</h4>
            </div>
          }
          destroyOnClose
        >
          <Row>
            <Col span={12}>booked by: </Col>
            <Col span={12}>
              <b>{selectedBooking && selectedBooking.authorName}</b>
            </Col>
          </Row>
          <Row>
            <Col span={12}>space/equipment: </Col>
            <Col span={12}>
              <b>{selectedBooking && selectedBooking.room}</b>
            </Col>
          </Row>
          <Row style={{ paddingTop: 12 }}>
            <Row span={24}>
              {selectedBooking && selectedBooking.isPublicActivity && (
                <Link
                  to={
                    (selectedBooking.isGroup ? '/group/' : '/event/') +
                    selectedBooking._id
                  }
                >
                  {' '}
                  {!selectedBooking.isPrivateGroup &&
                    `go to the ${selectedBooking.isGroup ? 'group ' : 'event '}
                    page`}
                </Link>
              )}
            </Row>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default Calendar;
