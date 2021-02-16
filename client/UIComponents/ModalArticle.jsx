import React from 'react';
import { Modal, Card, Avatar } from 'antd';
import renderHTML from 'react-render-html';
const { Meta } = Card;

const getInitials = (string) => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

class ModalArticle extends React.Component {
  render() {
    const { item, imageSrc, isLoading, ...otherProps } = this.props;

    return (
      <Modal
        maskClosable={false}
        closable={!isLoading}
        okButtonProps={{ loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        style={{ top: 20 }}
        {...otherProps}
      >
        <Card
          title={
            <div>
              <h1>{item.title}</h1>
            </div>
          }
          bordered={false}
          cover={imageSrc ? <img alt="image" src={imageSrc} /> : null}
        >
          <Meta
            avatar={<Avatar>{getInitials(item.authorName || 'ad')}</Avatar>}
            title={item.room || item.readingMaterial}
            description={renderHTML(item.longDescription || item.description)}
          />
        </Card>
      </Modal>
    );
  }
}

export default ModalArticle;
