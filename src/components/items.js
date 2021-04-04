import React from 'react';
import UpdateForm from './update-item';
import Jumbotron from 'react-bootstrap/Jumbotron'

class Items extends React.Component {

  render() {

    return (
      <section>
        <Jumbotron fluid>
          <h2>Saved Emails</h2>
          {
            this.props.itemsList.map((item, idx) =>
              <div key={idx}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <blockquote>{item.notes}</blockquote>
                <UpdateForm item={item} handleUpdate={this.props.handleUpdate} />
                <button
                  data-testid={`delete-button-${item.name}`}
                  onClick={() => this.props.handleDelete(item._id)}
                >Delete Item</button>
              </div>
            )
          }
        </Jumbotron>
      </section>
    );
  }
}

export default Items;
