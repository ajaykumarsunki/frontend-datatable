import React, { Component } from "react";
import TableRow from "./TableRow";

export default class Table extends Component {
  constructor() {
    super();

    this.state = {
      data: { contacts: [] },
      error: null,
      sortConfig: {
        sortColumn: "contact_name",
        sortOrder: 1, //1 = ascending, else descending
      },
      selectedIds: [],
      selectAllOrNone: 0, //default: 0, select all: 1, select none: -1
    };

    this.onLoadClicked = this.onLoadClicked.bind(this);
    this.sortTable = this.sortTable.bind(this);
  }

  componentWillMount() {
    this.onLoadClicked();
  }

  componentDidUpdate() {
    console.log(
      "total: " +
        this.state.selectedIds.length +
        " | " +
        this.state.selectedIds.join(" | ")
    );
  }

  getAllContacts = () => {
    return fetch("https://react-datatable-backend.herokuapp.com/contacts", {
      method: "GET",
    })
      .then((res) => res.json())
      .catch((err) => err.json());
  };

  modifySelectedContacts = (contact, isChecked) => {
    const { selectedIds } = this.state;
    const contactId = contact.contact_id;

    if (isChecked) {
      this.setState({
        selectedIds: [...selectedIds, contactId],
      });
    } else {
      const arrAfterDeleting = selectedIds.filter((x) => x != contactId);
      this.setState({
        selectedIds: arrAfterDeleting,
      });
    }
  };

  onLoadClicked = () => {
    this.getAllContacts()
      .then((data) => {
        this.setState({ data: data });
      })
      .catch((err) => this.setState({ error: err }));
  };

  //sorting function
  sortedTable = (tbl) => {
    const { sortConfig } = this.state;
    if (sortConfig.sortColumn != "") {
      let sortedTbl = [...tbl];
      let sortColumn = sortConfig.sortColumn;
      let sortOrder = sortConfig.sortOrder;

      //sort using a custom function
      sortedTbl.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
          return -1 * sortOrder;
        }
        if (a[sortColumn] == b[sortColumn]) {
          return 0;
        }
        if (a[sortColumn] > b[sortColumn]) {
          return 1 * sortOrder;
        }
      });
      return sortedTbl;
    }

    //if sortconfig is not set, return table as is
    else return tbl;
  };

  sortTable = (event, colName) => {
    event.preventDefault();

    let { sortColumn, sortOrder } = this.state.sortConfig;
    if (colName == sortColumn) {
      sortOrder = sortOrder * -1;
    }

    this.setState({ sortConfig: { sortColumn: colName, sortOrder } });

    const { contacts } = this.state.data;
    this.renderContacts(contacts);
  };

  doSelectAllOrNone = function (evt) {
    const { selectedIds } = this.state;
    const { contacts } = this.state.data;

    const isChecked = evt.target.checked;

    let selection = [];

    //clear selection
    if (!isChecked) {
      this.setState({
        selectedIds: selection,
        selectAllOrNone: -1,
      });
    }
    //else select all
    else {
      selection = contacts.map((c) => c.contact_id);
      this.setState({
        selectedIds: selection,
        selectAllOrNone: 1,
      });
    }
  };

  resetSelectAllOrNone = () => this.setState({ selectAllOrNone: 0 });

  renderContacts = (arr) => {
    let sortedTbl = this.sortedTable(arr);

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>
                <button onClick={(e) => this.sortTable(e, "contact_name")}>
                  <span className="th">NAME</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th>
                <button onClick={(e) => this.sortTable(e, "company_name")}>
                  <span className="th">COMPANY NAME</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th>
                <button onClick={(e) => this.sortTable(e, "email")}>
                  <span className="th">EMAIL</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th style={{ width: "175px" }}>
                <button onClick={(e) => this.sortTable(e, "phone")}>
                  <span className="th">WORK PHONE</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th style={{ width: "190px" }}>
                <button onClick={(e) => this.sortTable(e, "gst_treatment")}>
                  <span className="th">GST TREATMENT </span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th style={{ width: "175px" }}>
                <button
                  onClick={(e) =>
                    this.sortTable(e, "outstanding_receivable_amount")
                  }
                >
                  <span className="th">RECEIVABLES</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
              <th style={{ width: "175px" }}>
                <button
                  onClick={(e) =>
                    this.sortTable(e, "outstanding_payable_amount")
                  }
                >
                  <span className="th">PAYABLES</span>
                  <span className="arrows">⇅</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTbl.map((c, idx) => {
              return (
                <TableRow
                  key={idx}
                  contact={c}
                  addSelection={this.modifySelectedContacts}
                  selectAllOrNone={this.state.selectAllOrNone}
                  resetSelectAllOrNone={this.resetSelectAllOrNone}
                />
              );
            })}
          </tbody>
        </table>
        <p className="selection-count">{`${this.state.selectedIds.length} selected`}</p>
      </div>
    );
  };

  render() {
    const { contacts } = this.state.data;

    return (
      <div>
        <div className="results">
          {contacts.length ? this.renderContacts(contacts) : ""}
        </div>
      </div>
    );
  }
}
