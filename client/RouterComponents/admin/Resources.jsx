import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Input, Button, message } from 'antd/lib';
import AdminMenu from '../../UIComponents/AdminMenu';
import { call } from '../../functions';
import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';

const Resources = ({ history }) => {
  const [places, setPlaces] = useState([]);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    getPlaces();
  }, []);

  // if (!places || (places && places.length === 0)) {
  //   return <Loader />;
  // }

  const getPlaces = async () => {
    try {
      const response = await call('getPlaces');
      setPlaces(response);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const removePlace = async place => {
    try {
      await call('removePlace', place._id);
      message.success('Place is successfully removed');
      getPlaces();
    } catch (error) {
      message.error(error.reason);
    }
  };

  const addPlace = async name => {
    try {
      await call('addPlace', name);
      message.success('Your place succesfully added to the list');
      getPlaces();
      setAddModal(false);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const currentPath = history && history.location.pathname;

  const placesWithActions = places.map(place => ({
    ...place,
    actions: [
      {
        content: 'Remove',
        handleClick: () => removePlace(place),
        isDisabled: false
      }
    ]
  }));

  return (
    <div>
      <Row gutter={24}>
        <Col md={8}>
          <AdminMenu currentPath={currentPath} />
        </Col>

        <Col md={8} style={{ padding: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Shared Resources</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12
            }}
          >
            <Button onClick={() => setAddModal(true)}>Add</Button>
          </div>
          {places && (
            <NiceList list={placesWithActions}>
              {place => <h4>{place.name}</h4>}
            </NiceList>
          )}
        </Col>

        <Col md={8} />
      </Row>

      <Modal
        className="addSpace-modal"
        title="Add a space/equipment for booking"
        visible={addModal}
        onOk={() => setAddModal(false)}
        onCancel={() => setAddModal(false)}
      >
        <h3>
          Please enter the name of the space or equipment to be added to the
          list
        </h3>
        <Input.Search
          placeholder="type and press enter"
          enterButton="Add"
          size="large"
          onSearch={value => addPlace(value)}
        />
      </Modal>
    </div>
  );
};

export default Resources;
