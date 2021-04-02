import React from 'react';

class UpdateItemForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item
    };
  }

  handleChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const item = this.state.item;
    item[field] = value;
    this.setState(item);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleUpdate(this.state.item)
  }

  render() {

    return (
      <form data-testid={`update-form-${this.props.item.name}`} onSubmit={this.handleChange}>
        <input data-testid={`update-field-${this.props.item.name}`} name="notes" placeholder="Add Notes" onChange={this.handleChange} />
        <button type="submit">Update Item</button>
      </form>
    );
  }
}

export default UpdateItemForm;
