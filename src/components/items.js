import React from 'react';

import UpdateForm from './update-item';

class Items extends React.Component {

  render() {

    return (
      <section>
        <h2>Items...</h2>
        {
          this.props.itemsList.forEach( (item,idx) =>
            <div key={idx}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <blockquote>{item.notes}</blockquote>
              <UpdateForm item={item} handleUpdate={this.props.handleUpdate} />
              <button
                data-testid={`delete-button-${item.name}`}
                onClick={ () => this.props.handleDelete(item._id) }
              >Delete Item</button>
            </div>
          )
        }
      </section>
    );
  }
}

export default Items;
