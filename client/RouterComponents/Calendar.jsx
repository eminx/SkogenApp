import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import {
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Popover,
  Row,
  Spin,
  Tag,
  Tooltip,
  message,
} from 'antd';
import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import NiceList from '../UIComponents/NiceList';
import QMarkPop from '../UIComponents/QMarkPop';
import colors from '../constants/colors';

const yesterday = moment(new Date()).add(-1, 'days');

const popoverStyle = { maxWidth: 280, fontSize: 14, lineHeight: 1.3 };

const helperText =
  'This is where you can find Skogens use of spaces and planned events and activities. It is bookable by Skogen artists and study groups.';

const manualsHelperText =
  'Here you find information that you might need as you work or make things happen at Skogen.';

class Calendar extends PureComponent {
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
              <Button type="primary" component="span">
                New Booking
              </Button>
            </Link>
            <QMarkPop>{helperText}</QMarkPop>
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
                <Tooltip title="Show all">
                  <Tag.CheckableTag
                    checked={calendarFilter === 'All rooms'}
                    onChange={() =>
                      this.handleCalendarFilterChange('All rooms')
                    }
                    key={'All rooms'}
                  >
                    {'All'}
                  </Tag.CheckableTag>
                </Tooltip>
                {placesList.map((room, i) => (
                  <Popover
                    key={room.name}
                    content={<div style={popoverStyle}>{room.description}</div>}
                  >
                    <Tag
                      color={colors[i]}
                      className={
                        calendarFilter === room.name ? 'checked' : null
                      }
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.handleCalendarFilterChange(room.name)}
                    >
                      {room.name}
                    </Tag>
                  </Popover>
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

        <h3 style={{ textAlign: 'center' }}>
          Skogen Manuals <QMarkPop>{manualsHelperText}</QMarkPop>
        </h3>
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
                  <div
                    key={manual.documentLabel}
                    style={{
                      width: '100%',
                      marginBottom: 0,
                      padding: '0 12px',
                    }}
                  >
                    <h3>
                      <a href={manual.documentUrl} target="_blank">
                        {manual.documentLabel}
                      </a>
                    </h3>
                  </div>
                )}
              </NiceList>
            )}
          </Col>
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
