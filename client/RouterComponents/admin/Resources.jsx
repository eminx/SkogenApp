import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Input, Button, message } from 'antd';

import AdminMenu from '../../UIComponents/AdminMenu';
import { call } from '../../functions';
import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';

const FormItem = Form.Item;
const { TextArea } = Input;

const Resources = ({ history }) => {
  const [resources, setResources] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editableResource, setEditableResource] = useState(null);

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    try {
      const response = await call('getResources');
      setResources(response);
      setEditableResource(null);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const editResource = async (values) => {
    try {
      await call('editResource', values, editableResource._id);
      message.success(`${values.name} is successfully updated`);
      getResources();
      setEditModal(false);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const removeResource = async (resource) => {
    try {
      await call('removeResource', resource._id);
      message.success(`${resource.name} is successfully removed`);
      getResources();
    } catch (error) {
      message.error(error.reason);
    }
  };

  const addResource = async (values) => {
    try {
      await call('addResource', values);
      message.success('Your resource succesfully added to the list');
      getResources();
      setAddModal(false);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const currentPath = history && history.location.pathname;

  const openEditResource = (resource) => {
    setEditModal(true);
    setEditableResource(resource);
  };

  const closeEditResource = () => {
    setEditModal(false);
    setEditableResource(null);
  };

  const resourcesWithActions = resources.map((resource) => ({
    ...resource,
    actions: [
      {
        content: 'Edit',
        handleClick: () => openEditResource(resource),
        isDisabled: false,
      },
      {
        content: 'Remove',
        handleClick: () => removeResource(resource),
        isDisabled: false,
      },
    ],
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
              padding: 12,
            }}
          >
            <Button onClick={() => setAddModal(true)}>Add</Button>
          </div>
          {resources && (
            <NiceList list={resourcesWithActions}>
              {(resource) => <h4>{resource.name}</h4>}
            </NiceList>
          )}
        </Col>

        <Col md={8} />
      </Row>

      <Modal
        destroyOnClose
        className="addSpace-modal"
        title="Add a Resource"
        visible={addModal}
        onCancel={() => setAddModal(false)}
      >
        <ResourceWidget onFinish={(values) => addResource(values)} />
      </Modal>

      <Modal
        destroyOnClose
        className="addSpace-modal"
        title="Edit the Resource"
        visible={editModal}
        onCancel={() => closeEditResource()}
      >
        <ResourceWidget
          resource={editableResource}
          onFinish={(values) => editResource(values)}
        />
      </Modal>
    </div>
  );
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function ResourceWidget({ resource, onFinish }) {
  return (
    <Form initialValues={resource} onFinish={onFinish}>
      <FormItem
        {...formItemLayout}
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Please input title of the resource!' },
        ]}
      >
        <Input />
      </FormItem>

      <FormItem {...formItemLayout} label="Description" name="description">
        <TextArea />
      </FormItem>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" htmlType="submit">
          Confirm
        </Button>
      </div>
    </Form>
  );
}

export default Resources;
