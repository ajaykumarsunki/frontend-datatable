import React, { Component } from "react";

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    console.log("constructor");

    this.state = {
      isChecked: false,
    };

    this.handleChkChange = this.handleChkChange.bind(this);
  }

  handleChkChange = (evt) => this.props.handleChange(evt);

  render() {
    return (
      <input
        type="checkbox"
        onChange={this.handleChkChange}
        checked={this.props.isChecked}
      />
    );
  }
}
