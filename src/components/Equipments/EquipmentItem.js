import React from 'react';

const EquipmentItem = ({ equipment, onRemoveEquipment }) => (
  <tr>
    <td>{equipment.number}</td>
    <td>{equipment.name}</td>
    <td>{equipment.mark}</td>
    <td>{equipment.serial}</td>
    <td>{equipment.release}</td>
    <td>{equipment.periodicity}</td>
    <td>{equipment.lastCalibration}</td>
    <td>{equipment.nextCalibration}</td>
    <td>{equipment.puttingInStorage}</td>
    <td>{equipment.removingFromStorage}</td>
    <td>
      {equipment.responsible}
      {equipment.userId}
      <button
        type="button"
        onClick={() => onRemoveEquipment(equipment.uid)}
      >
        Удалить СИ/ИО
      </button>
    </td>
    <td>{equipment.notes}</td>
  </tr>
);

export default EquipmentItem;
