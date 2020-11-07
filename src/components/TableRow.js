import React from "react";
import CheckBox from "./CheckBox";

function TableRow(props) {
  const { contact, selectAllOrNone } = props;

  const handleChkChange = function (evt) {
    props.addSelection(contact, evt.target.checked);
    props.resetSelectAllOrNone();
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <tr>
      <td>
        <CheckBox
          selectAllOrNone={selectAllOrNone}
          isChecked={
            selectAllOrNone == 1
              ? true
              : selectAllOrNone == -1
              ? false
              : undefined
          }
          handleChange={handleChkChange}
        />
      </td>
      <td>{contact.contact_name}</td>
      <td>{contact.company_name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>{contact.gst_treatment}</td>
      <td className="right-justify">
        {formatter.format(contact.outstanding_receivable_amount)}
      </td>
      <td className="right-justify">
        {formatter.format(contact.outstanding_payable_amount)}
      </td>
    </tr>
  );
}

export default TableRow;
