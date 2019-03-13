import React from 'react';

const EquipmentItem = ({ equipment }) => (
  <li>
    <strong>{equipment.number}</strong> {equipment.name} {equipment.userId}
  </li>
);

export default EquipmentItem;
