import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import Equipments from '../Equipments';
import './Journal_T12.css';

const Journal_T12 = () => (
  <div>
    <h1>Химическая лаборатория "Топливо"</h1>
    <h2>Журнал учета оборудования (СИ и ИО)</h2>

    <table className="table">
      <tr>
        <th>№ п/п</th>
        <th>Наименование оборудования (ИО, СИ)</th>
        <th>Марка, тип</th>
        <th>Заводской номер (инв. номер)</th>
        <th>Год выпуска (ввода в эксплу-атацию)</th>
        <th>Периодич-ность метролог. аттестации, поверки, калибровки, мес.</th>
        <th>Дата последней аттестации, поверки, калибровки</th>
        <th>Дата следующей аттестации, поверки, калибровки</th>
        <th>Дата консер-вации</th>
        <th>Дата расконсер-вации</th>
        <th>Ответственный</th>
        <th>Примечания</th>
      </tr>
      <tr>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>11</th>
        <th>12</th>
      </tr>
      <Equipments />
    </table>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Journal_T12);
