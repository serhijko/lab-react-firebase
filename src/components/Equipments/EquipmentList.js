import React from 'react';

import EquipmentItem from './EquipmentItem';

const EquipmentList = ({ equipments }) => (
  <ul>
    {equipments.map(equipment => (
      <EquipmentItem key={equipment.uid} equipment={equipment} />
    ))}
  </ul>
);

export default EquipmentList;
