import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROUTES from '../../constants/routes';
import Equipments from '../Equipments';

const HomePage = () => (
  <div>
    <h1>Испытательный центр</h1>
    <h2>Химическая лаборатория "Топливо"</h2>
    <h3>Журналы учета оборудования (ИО и СИ), химических реактивов</h3>
    <Link to={ROUTES.JOURNAL_T12}>Т-12 Журнал учета оборудования СМК-ХЛТ-03-ЖУО-011-2019</Link>
    <Equipments />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
