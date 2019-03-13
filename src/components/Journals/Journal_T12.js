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

class Journal_T12 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      equipments: [],
      number: '',
      name: '',
      mark: '',
      serial: '',
      release: '',
      periodicity: '',
      lastCalibration: '',
      nextCalibration: '',
      puttingInStorage: '',
      removingFromStorage: '',
      responsible: '',
      notes: '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.equipments().on('value', snapshot => {
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
        this.setState({ equipments: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.equipments().off();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onCreateEquipment = (event, authUser) => {
    this.props.firebase.equipments().push({
      number: this.state.number,
      name: this.state.name,
      mark: this.state.mark,
      serial: this.state.serial,
      release: this.state.release,
      periodicity: this.state.periodicity,
      lastCalibration: this.state.lastCalibration,
      nextCalibration: this.state.nextCalibration,
      puttingInStorage: this.state.puttingInStorage,
      removingFromStorage: this.state.removingFromStorage,
      responsible: this.state.responsible,
      notes: this.state.notes,
      userId: authUser.uid,
    });

    this.setState({
      number: '',
      name: '',
      mark: '',
      serial: '',
      release: '',
      periodicity: '',
      lastCalibration: '',
      nextCalibration: '',
      puttingInStorage: '',
      removingFromStorage: '',
      responsible: '',
      notes: '',
    });

    event.preventDefault();
  };

  onRemoveEquipment = uid => {
    this.props.firebase.equipment(uid).remove();
  };

  render() {
    const {
      loading,
      equipments,
      number,
      name,
      mark,
      serial,
      release,
      periodicity,
      lastCalibration,
      nextCalibration,
      puttingInStorage,
      removingFromStorage,
      responsible,
      notes,
    } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Химическая лаборатория "Топливо"</h1>
            <h2>Журнал учета оборудования (СИ и ИО)</h2>
    
            <form onSubmit={event => this.onCreateEquipment(event, authUser)}>
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
                {loading && <div>Loading ...</div>}
      
                {equipments ? (
                  equipments.map(equipment => (
                    <EquipmentItem
                      key={equipment.uid}
                      equipment={equipment}
                      onRemoveEquipment={this.onRemoveEquipment}
                    />
                  ))
                ) : (
                  <div>Нет ИО и СИ ...</div>
                )}
      
                <tr>
                  <td>
                    <input
                      name="number"
                      size="1"
                      type="text"
                      value={number}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="name"
                      size="12"
                      type="text"
                      value={name}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="mark"
                      size="8"
                      type="text"
                      value={mark}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="serial"
                      size="8"
                      type="text"
                      value={serial}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="release"
                      size="10"
                      type="text"
                      value={release}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="periodicity"
                      size="10"
                      type="text"
                      value={periodicity}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="lastCalibration"
                      size="10"
                      type="text"
                      value={lastCalibration}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="nextCalibration"
                      size="10"
                      type="text"
                      value={nextCalibration}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="puttingInStorage"
                      size="10"
                      type="text"
                      value={puttingInStorage}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="removingFromStorage"
                      size="10"
                      type="text"
                      value={removingFromStorage}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="responsible"
                      size="10"
                      type="text"
                      value={responsible}
                      onChange={this.onChange}
                    />
                  </td>
                  <td>
                    <input
                      name="notes"
                      size="10"
                      type="text"
                      value={notes}
                      onChange={this.onChange}
                    />
                    <button type="submit">+</button>
                  </td>
                </tr>
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
