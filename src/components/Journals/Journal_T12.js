import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext,
} from '../Session';
import { withFirebase } from '../Firebase';
import {
  EquipmentItem,
  nextDate,
  nextCalibrationTime,
} from '../Equipments';
import './Journal_T12.css';

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
          });
        } else {
          this.setState({
            equipments: null,
            loading: false,
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
    const nextCalibration = nextDate(this.state.data06, this.state.data07);
    this.props.firebase.equipments().push({
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      createdBy: authUser.uid,
      data01: parseInt(this.state.data01, 10),
      data02: this.state.data02,
      data03: this.state.data03,
      data04: this.state.data04,
      data05: this.state.data05,
      data06: this.state.data06,
      data07: this.state.data07,
      data08: nextCalibration,
      data09: this.state.data09,
      data10: this.state.data10,
      data11: nextCalibrationTime(nextCalibration, this.state.data09, this.state.data10),
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
      data11: '',
      data12: '',
    });

    event.preventDefault();
  };

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
    }));
  };

  onEditData = (equipment, data, authUser) => {
    const editingData = authUser ? (
      {
        editedAt: this.props.firebase.serverValue.TIMESTAMP,
        editedBy: authUser.uid,
      }
    ) : {};
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      ...data,
      ...editingData,
    });
  };

  onRemoveEquipment = uid => {
    this.props.firebase.equipment(uid).remove();
  };

  renderCell(i, dataXX) {
    let name="data" + (i < 10 ? "0" : "") + i;
    let size="";
    switch(i) {
      case 1:
        size = "1";
        break;
      case 2:
        size = "12";
        break;
      case 3: case 4:
        size = "8";
        break;
      case 5: case 7: case 9: case 10: case 12:
        size = "10";
        break;
      case 6:
        size = "2";
        break;
      default:
        break;
    }

    let type = "";
    if (i === 6) {
      type = "number";
    } else if (i > 6 && i < 11) {
      type = "date";
    } else {
      type = "text";
    }

    return (
      <td key={name}>{(i === 11) ? (
        <button type="submit">Добавить</button>
      ) : ((i < 8 || i > 8) && 
        <input
          name={name}
          size={size}
          type={type}
          value={dataXX}
          onChange={this.onChange}
        />
      )}
      </td>
    );
  }

  renderCells(data) {
    let cells = [];
    for (let i = 1; i <= 12; i++) {
      let name="data" + (i < 10 ? "0" : "") + i;
      cells.push(this.renderCell(i, data[name]));
    }
    return cells;
  }

  render() {
    const {
      loading,
      equipments,
      editMode,
      users,
      ...data
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
                    equipments.map(equipment => (
                      <EquipmentItem
                        key={equipment.uid}
                        authUser={authUser}
                        users={users}
                        equipment={equipment}
                        editMode={editMode}
                        onEditData={this.onEditData}
                        onRemoveEquipment={this.onRemoveEquipment}
                      />
                    ))
                  ) : (
                    <tr><td colSpan="12">Нет ИО и СИ ...</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    {this.renderCells(data)}
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
