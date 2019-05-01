import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext,
} from '../Session';
import { withFirebase } from '../Firebase';
import { EquipmentItem } from '../Equipments';
import './Journal_T12.css';
import nextDate from '../Equipments/nextCalibrationCalculation';

class Journal_T12 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      equipments: [],
      data01: '',
      data02: '',
      data03: '',
      data04: '',
      data05: '',
      data06: '',
      data07: '',
      data08: '',
      data09: '',
      data10: '',
      data11: '',
      data12: '',
      editMode: false,
      users: null,
    };
  }

  componentDidMount() {
    this.onListenForUsers();
    this.onListenForEquipments();
  }
  
  onListenForUsers() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      });
    });
  }

  onListenForEquipments() {
    this.setState({ loading: true });

    this.props.firebase
      .equipments()
      .on('value', snapshot => {
        const equipmentObject = snapshot.val();
        
        if (equipmentObject) {
          // convert equipment list from snapshot
          const equipmentList = Object.keys(equipmentObject).map(key => ({
            ...equipmentObject[key],
            uid: key,
          }));

          this.setState({
            equipments: equipmentList,
            loading: false,
            length: equipmentList.length,
          });
        } else {
          this.setState({
            equipments: null,
            loading: false,
            length: 0,
          });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.equipments().off();
    this.props.firebase.users().off();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onCreateEquipment = (event, authUser) => {
    this.props.firebase.equipments().push({
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      createdBy: authUser.uid,
      data01: this.state.data01/1,
      data02: this.state.data02,
      data03: this.state.data03,
      data04: this.state.data04,
      data05: this.state.data05,
      data06: this.state.data06,
      data07: this.state.data07,
      data08: this.setState({ data08: nextDate(this.state.data06, this.state.data07) }),
      data09: this.state.data09,
      data10: this.state.data10,
      data11: this.setState({ data11: this.state.data08.getTime() }),
      data12: this.state.data12,
    });

    this.setState({
      data01: '',
      data02: '',
      data03: '',
      data04: '',
      data05: '',
      data06: '',
      data07: '',
      data08: '',
      data09: '',
      data10: '',
      data11: null,
      data12: '',
    });

    event.preventDefault();
  };

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
    }));
  };

  onEditData06 = (equipment, data06, data08, data11, authUser) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data06,
      data08,
      data11,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
      editedBy: authUser.uid,
    });
  };

  onEditData07 = (equipment, data07, data08, data11, authUser) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data07,
      data08,
      data11,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
      editedBy: authUser.uid,
    });
  };

  onEditData09 = (equipment, data09, data11, authUser) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data09,
      data11,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
      editedBy: authUser.uid,
    });
  };

  onEditData10 = (equipment, data10, data11, authUser) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data10,
      data11,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
      editedBy: authUser.uid,
    });
  };

  onEditData12 = (equipment, data12) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data12,
    });
  };

  onRemoveEquipment = uid => {
    this.props.firebase.equipment(uid).remove();
  };

  render() {
    const {
      loading,
      equipments,
      data01,
      data02,
      data03,
      data04,
      data05,
      data06,
      data07,
      data09,
      data10,
      data12,
      editMode,
      users,
    } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Химическая лаборатория "Топливо"</h1>
            <h2>Журнал учета оборудования (СИ и ИО)
            <button
              type="button"
              onClick={this.onToggleEditMode}
            >
              {!editMode ? (
                'Включить режим правки таблицы'
              ) : (
                'Выключить режим правки таблицы'
              )}
            </button></h2>
    
            <form onSubmit={event => this.onCreateEquipment(event, authUser)}>
              <table className="scroll">
                <thead>
                  <tr>
                    <th>№ п/п</th>
                    <th>Наименование оборудования (ИО, СИ)</th>
                    <th>Марка, тип</th>
                    <th>Заводской номер (инв. номер)</th>
                    <th>Год выпуска (ввода в эксплуатацию)</th>
                    <th>Периодичность метролог. аттестации, поверки, калибровки, мес.</th>
                    <th>Дата последней аттестации, поверки, калибровки</th>
                    <th>Дата следующей аттестации, поверки, калибровки</th>
                    <th>Дата консервации</th>
                    <th>Дата расконсервации</th>
                    <th>Ответственный</th>
                    <th>Примечания</th>
                  </tr>
                  <tr>
                    <th className="r2">1</th>
                    <th className="r2">2</th>
                    <th className="r2">3</th>
                    <th className="r2">4</th>
                    <th className="r2">5</th>
                    <th className="r2">6</th>
                    <th className="r2">7</th>
                    <th className="r2">8</th>
                    <th className="r2">9</th>
                    <th className="r2">10</th>
                    <th className="r2">11</th>
                    <th className="r2">12</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="12">Загрузка...</td></tr>}
        
                  {equipments ? (
                    equipments.map(equipment => ({
                      ...equipment,
                      user: users
                        ? users[equipment.createdBy]
                        : { createdBy: equipment.createdBy }
                    })).map(equipment => (
                      <EquipmentItem
                        key={equipment.uid}
                        authUser={authUser}
                        equipment={equipment}
                        editMode={editMode}
                        onEditData06={this.onEditData06}
                        onEditData07={this.onEditData07}
                        onEditData09={this.onEditData09}
                        onEditData10={this.onEditData10}
                        onEditData12={this.onEditData12}
                        onRemoveEquipment={this.onRemoveEquipment}
                      />
                    ))
                  ) : (
                    <tr><td colSpan="12">Нет ИО и СИ ...</td></tr>
                  )}
                </tbody>
                <tfoot>
                <tr>
                    <td>
                      <input
                        name="data01"
                        size="1"
                        type="text"
                        value={data01}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data02"
                        size="12"
                        type="text"
                        value={data02}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data03"
                        size="8"
                        type="text"
                        value={data03}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data04"
                        size="8"
                        type="text"
                        value={data04}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data05"
                        size="10"
                        type="text"
                        value={data05}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data06"
                        size="2"
                        type="number"
                        step="12"
                        value={data06}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data07"
                        size="10"
                        type="date"
                        value={data07}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                    </td>
                    <td>
                      <input
                        name="data09"
                        size="10"
                        type="date"
                        value={data09}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <input
                        name="data10"
                        size="10"
                        type="date"
                        value={data10}
                        onChange={this.onChange}
                      />
                    </td>
                    <td>
                      <button type="submit">Добавить</button>
                    </td>
                    <td>
                      <input
                        name="data12"
                        size="10"
                        type="text"
                        value={data12}
                        onChange={this.onChange}
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withEmailVerification,
  withFirebase,
)(Journal_T12);
