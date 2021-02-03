import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../themes/skogen';

import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Select,
  InputNumber,
  Upload,
  Divider,
  Modal,
} from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import moment from 'moment';

const compareForSort = (a, b) => {
  const dateA = moment(a.startDate, 'YYYY-MM-DD');
  const dateB = moment(b.startDate, 'YYYY-MM-DD');
  return dateA.diff(dateB);
};

const defaultCapacity = 40;

let emptyDateAndTime = {
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  attendees: [],
  capacity: defaultCapacity,
};

const skogenAddress = 'Masthuggsterrassen 3, SE-413 18 Göteborg, Sverige';
const defaultPracticalInfo = `MAT: Efter föreställning serveras en vegetarisk middag, välkommen att stanna och äta med oss. \n\n
BILJETTPRIS: Skogen har inget fast biljettpris. Välkommen att donera för konst och mat när du går. Kontanter / Swish.`;

const iconStyle = {
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 24,
  backgroundColor: '#f8f8f8',
};

class CreateBookingForm extends Component {
  state = {
    datesAndTimes: [emptyDateAndTime],
  };

  componentDidMount() {
    this.setDatesAndTimes();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.bookingData && this.props.bookingData) {
      this.setDatesAndTimes();
    }
  }

  setDatesAndTimes = () => {
    const { bookingData } = this.props;
    if (!bookingData) {
      return;
    }

    const datesAndTimesSorted = bookingData.datesAndTimes.sort(compareForSort);

    const datesAndTimesWithMoment = datesAndTimesSorted.map((recurrence) => {
      const rangeInMoment = [
        moment(
          recurrence.startDate + ' ' + recurrence.startTime,
          'YYYY-MM-DD HH:mm'
        ),
        moment(
          recurrence.endDate + ' ' + recurrence.endTime,
          'YYYY-MM-DD HH:mm'
        ),
      ];
      return {
        ...recurrence,
        // startDateMoment: moment(recurrence.startDate, 'YYYY-MM-DD'),
        // startTimeMoment: moment(recurrence.startTime, 'HH:mm'),
        // endDateMoment: moment(recurrence.endDate, 'YYYY-MM-DD'),
        // endTimeMoment: moment(recurrence.endTime, 'HH:mm'),
        rangeInMoment,
        attendees: recurrence.attendees || [],
      };
    });

    this.setState({
      datesAndTimes: datesAndTimesWithMoment,
    });
  };

  addRecurrence = () => {
    this.setState({
      datesAndTimes: [...this.state.datesAndTimes, { ...emptyDateAndTime }],
    });
  };

  removeRecurrence = (index) => {
    const allOccurences = [...this.state.datesAndTimes];
    allOccurences.splice(index, 1);

    this.setState({
      datesAndTimes: allOccurences,
    });
  };

  handleSubmit = (fieldsValue) => {
    const { datesAndTimes } = this.state;
    const { isPublicActivity, registerGatheringLocally } = this.props;

    if (this.props.isPublicActivity && !this.props.uploadableImage) {
      Modal.error({
        title: 'Image is required',
        content: 'Please upload an image',
      });
      return;
    }

    const datesAndTimesWithoutMoment = datesAndTimes.map((recurrence) => ({
      startDate: recurrence.startDate,
      startTime: recurrence.startTime,
      endDate: recurrence.endDate,
      endTime: recurrence.endTime,
      capacity: isPublicActivity && (recurrence.capacity || defaultCapacity),
      attendees: recurrence.attendees || [],
    }));

    const values = {
      title: fieldsValue['title'],
      subTitle: fieldsValue['subTitle'],
      longDescription: fieldsValue['longDescription'],
      datesAndTimes: datesAndTimesWithoutMoment,
    };

    if (isPublicActivity) {
      values.room = fieldsValue['room'];
      values.place = fieldsValue['place'];
      values.address = fieldsValue['address'];
      values.practicalInfo = fieldsValue['practicalInfo'];
      values.internalInfo = fieldsValue['internalInfo'];
    } else {
      values.room = fieldsValue['room'];
    }

    registerGatheringLocally(values);
  };

  renderDateTime = () => {
    const { datesAndTimes } = this.state;
    const { isPublicActivity } = this.props;

    return (
      <div style={{ marginBottom: 12 }}>
        {datesAndTimes.map((recurrence, index) => (
          <DatesAndTimes
            key={index}
            recurrence={recurrence}
            removeRecurrence={() => this.removeRecurrence(index)}
            isNotDeletable={index === 0}
            isPublicActivity={isPublicActivity}
            // handleStartDateChange={(date, dateString) =>
            //   this.handleDateAndTimeChange(date, dateString, index, 'startDate')
            // }
            // handleStartTimeChange={(time, timeString) =>
            //   this.handleDateAndTimeChange(time, timeString, index, 'startTime')
            // }
            // handleFinishDateChange={(date, dateString) =>
            //   this.handleDateAndTimeChange(date, dateString, index, 'endDate')
            // }
            // handleFinishTimeChange={(time, timeString) =>
            //   this.handleDateAndTimeChange(time, timeString, index, 'endTime')
            // }
            handleRangeChange={(range, rangeString) =>
              this.handleRangeChange(range, rangeString, index)
            }
            handleCapacityChange={(value) =>
              this.handleCapacityChange(value, index)
            }
          />
        ))}
        <div style={{ ...iconStyle, padding: 24 }}>
          <PlusCircleOutlined
            onClick={this.addRecurrence}
            style={{ fontSize: 48, cursor: 'pointer' }}
          />
        </div>
      </div>
    );
  };

  // handleDateAndTimeChange = (date, dateString, index, entity) => {
  //   const { datesAndTimes } = this.state;
  //   const newDatesAndTimes = datesAndTimes.map((item, i) => {
  //     if (index === i) {
  //       item[entity + 'Moment'] = date;
  //       item[entity] = dateString;
  //     }
  //     return item;
  //   });
  //   this.setState({
  //     datesAndTimes: newDatesAndTimes,
  //   });
  // };

  handleRangeChange = (range, rangeString, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = datesAndTimes.map((item, i) => {
      if (index === i) {
        item.startDate = rangeString[0].split(' ')[0];
        item.startTime = rangeString[0].split(' ')[1];
        item.endDate = rangeString[1].split(' ')[0];
        item.endTime = rangeString[1].split(' ')[1];
        item.rangeInMoment = range;
      }
      return item;
    });
    this.setState({
      datesAndTimes: newDatesAndTimes,
    });
  };

  handleCapacityChange = (value, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = datesAndTimes.map((item, i) => {
      if (index === i) {
        item.capacity = value;
      }
      return item;
    });
    this.setState({
      datesAndTimes: newDatesAndTimes,
    });
  };

  render() {
    const {
      uploadableImage,
      setUploadableImage,
      places,
      bookingData,
      isPublicActivity,
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />
        <Form {...formItemLayout} onFinish={this.handleSubmit}>
          <FormItem
            name="title"
            rules={[
              {
                required: true,
                message: 'Enter the Title',
              },
            ]}
            initialValue={bookingData ? bookingData.title : null}
          >
            <Input placeholder="Title" />
          </FormItem>

          {isPublicActivity && (
            <FormItem
              name="subTitle"
              rules={[
                {
                  required: true,
                  message: 'Please enter a subtitle (typically artists name)',
                },
              ]}
              initialValue={
                bookingData && bookingData.subTitle ? bookingData.subTitle : ''
              }
            >
              <Input placeholder="Subtitle (i.e. the artist)" />
            </FormItem>
          )}

          <FormItem
            name="longDescription"
            rules={[
              {
                message: 'Please enter a detailed description (optional)',
              },
            ]}
            initialValue={bookingData ? bookingData.longDescription : null}
          >
            <ReactQuill modules={editorModules} formats={editorFormats} />
          </FormItem>

          {this.renderDateTime()}

          {isPublicActivity && (
            <FormItem
              className="upload-image-col"
              extra={uploadableImage ? null : 'Pick an image from your device'}
            >
              <Upload
                name="gathering"
                action="/upload.do"
                onChange={setUploadableImage}
              >
                {uploadableImage ? (
                  <Button>
                    <CheckCircleOutlined />
                    Image selected
                  </Button>
                ) : (
                  <Button>
                    <UploadOutlined />
                    Pick an image
                  </Button>
                )}
              </Upload>
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem
              name="place"
              rules={[
                {
                  required: true,
                  message: 'Please enter the name of the place',
                },
              ]}
              initialValue={
                bookingData && bookingData.place ? bookingData.place : 'Skogen'
              }
            >
              <Input placeholder="Please enter the name of the place" />
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please enter the address',
                },
              ]}
              initialValue={
                bookingData && bookingData.address
                  ? bookingData.address
                  : skogenAddress
              }
            >
              <Input placeholder="Please enter the address" />
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem
              name="practicalInfo"
              rules={[
                {
                  message: 'Please enter practical info (if any)',
                },
              ]}
              initialValue={
                bookingData && bookingData.practicalInfo
                  ? bookingData.practicalInfo
                  : ''
              }
            >
              <TextArea
                placeholder="Practical info"
                autosize={{ minRows: 3, maxRows: 6 }}
              />
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem
              name="internalInfo"
              rules={[
                {
                  message:
                    'Please enter internal info - shown only to Skogen members (if any)',
                },
              ]}
              initialValue={
                bookingData && bookingData.internalInfo
                  ? bookingData.internalInfo
                  : ''
              }
            >
              <TextArea
                placeholder="Internal info"
                autosize={{ minRows: 3, maxRows: 6 }}
              />
            </FormItem>
          )}

          <FormItem
            name="room"
            rules={[
              {
                required: true,
                message: 'Please enter which part of Skogen you want to book',
              },
            ]}
            initialValue={bookingData ? bookingData.room : 'Studio'}
          >
            <Select placeholder="Select space/equipment">
              {places
                ? places.map((part, i) => (
                    <Option key={part.name + i} value={part.name}>
                      {part.name}
                    </Option>
                  ))
                : null}
            </Select>
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default CreateBookingForm;

class DatesAndTimes extends Component {
  render() {
    const {
      recurrence,
      // handleStartDateChange,
      // handleStartTimeChange,
      // handleFinishDateChange,
      // handleFinishTimeChange,
      handleRangeChange,
      handleCapacityChange,
      removeRecurrence,
      isNotDeletable,
      isPublicActivity,
    } = this.props;

    return (
      <div
        style={{
          padding: 12,
          backgroundColor: '#f8f8f8',
          marginBottom: 12,
        }}
      >
        {!isNotDeletable && (
          <div style={iconStyle}>
            <DeleteOutlined
              onClick={removeRecurrence}
              style={{ fontSize: 18, cursor: 'pointer' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <RangePicker
            showTime
            showNow
            size="large"
            format="YYYY-MM-DD HH:mm"
            minuteStep={5}
            value={recurrence.rangeInMoment}
            onChange={handleRangeChange}
          />
        </div>

        {/* <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            onChange={handleStartDateChange}
            value={recurrence.startDateMoment}
            placeholder="Start date"
          />
        </FormItem>
        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleStartTimeChange}
            value={recurrence.startTimeMoment}
            format="HH:mm"
            minuteStep={5}
            placeholder="Start time"
          />
        </FormItem>
        <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            placeholder="Finish date"
            onChange={handleFinishDateChange}
            value={recurrence.endDateMoment}
          />
        </FormItem>
        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleFinishTimeChange}
            value={recurrence.endTimeMoment}
            format="HH:mm"
            minuteStep={5}
            placeholder="Finish time"
          />
        </FormItem> */}
        {isPublicActivity && (
          <FormItem style={{ marginBottom: 12 }}>
            <InputNumber
              min={1}
              max={90}
              placeholder={'Capacity'}
              value={recurrence.capacity}
              onChange={handleCapacityChange}
            />
          </FormItem>
        )}
      </div>
    );
  }
}
