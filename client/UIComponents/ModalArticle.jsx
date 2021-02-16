import React from 'react';
import { Modal, Card, Avatar } from 'antd';
import Loader from './Loader';
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
    const { item, imageSrc, ...otherProps } = this.props;

    return (
      <Modal {...otherProps} style={{ top: 20 }}>
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
            description={
              <div
                dangerouslySetInnerHTML={{
                  __html: item.longDescription || item.description,
                }}
              />
            }
          />
        </Card>
      </Modal>
    );
  }
}

export default ModalArticle;
