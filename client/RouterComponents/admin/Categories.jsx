import React, { useState, useEffect } from 'react';
import { Row, Col, Input, message, Tag } from 'antd/lib';
import AdminMenu from '../../UIComponents/AdminMenu';
import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

const Categories = ({ history, currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const addNewCategory = async () => {
    if (categoryInput.includes)
      try {
        await call('addNewCategory', categoryInput.toLowerCase(), 'work');
        getCategories();
        message.success(`${categoryInput} is successfully added`);
        setCategoryInput('');
      } catch (error) {
        message.error(error.reason);
        console.log(error);
      }
  };

  const removeCategory = async category => {
    try {
      await call('removeCategory', category._id);
      getCategories();
      message.success(
        `${category.label.toUpperCase()} is successfully removed`
      );
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const handleCategoryInputChange = value => {
    if (specialCh.test(value)) {
      message.destroy();
      message.error('Special characters, except dash (-), are not allowed');
    } else {
      setCategoryInput(value.toUpperCase());
    }
  };

  const currentPath = history && history.location.pathname;

  return (
    <div>
      <Row gutter={24}>
        <Col md={8}>
          <AdminMenu currentPath={currentPath} />
        </Col>

        <Col md={8} style={{ marginBottom: 48, paddingTop: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Categories</h2>
          <h4>Work Categories</h4>
          <p>You can set categories for work entries here</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map(category => (
              <Tag
                key={category._id}
                closable
                onClose={() => removeCategory(category)}
                color={category.color}
                style={{ marginBottom: 8 }}
              >
                {category.label.toUpperCase()}
              </Tag>
            ))}
          </div>

          <div>
            <Input.Search
              placeholder="type and press enter"
              enterButton="Add"
              size="large"
              value={categoryInput}
              onChange={event => handleCategoryInputChange(event.target.value)}
              onSearch={value => addNewCategory()}
            />
          </div>
        </Col>

        <Col md={8} />
      </Row>
    </div>
  );
};

export default Categories;
