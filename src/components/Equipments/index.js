import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext,
} from '../Session';
import { withFirebase } from '../Firebase';
import EquipmentItem, {
  nextDate,
  nextCalibrationTime,
} from './EquipmentItem';
import '../Journals/Journal_T12.css';

class Equipments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      equipments: [],
      editMode: false,
      date: new Date(),
      period: 45,
      users: null,
      error: null,
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
    const deadline = this.state.date;
    deadline.setDate(deadline.getDate() + this.state.period);
    this.setState({ loading: true });

    this.props.firebase
      .equipments()
      .orderByChild('data11')
      .endAt(deadline.getTime())
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

  onChangePeriod = event => {
    this.setState({ period: event.target.value });
  }

  onSavePeriod = (event, authUser) => {
    const { period } = this.state;

    this.props.firebase
      .then((authUser) => {
        // Create the period for authUser in Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            period,
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onEditPeriod = (equipment, data06, data08, authUser) => {
    this.props.firebase.equipment(equipment.uid).set({
      ...equipment,
      data06,
      data08,
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
      editMode,
      users,
      period,
    } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h3>Оборудование подлежащее метрологической аттестации, поверке, калибровке</h3>
            <form onSubmit={event => this.onSavePeriod(event, authUser)}>
              <p>на ближайшие <input
                                name="period"
                                size="1"
                                type="number"
                                step="1"
                                value={period}
                                onChange={this.onChangePeriod}
                              /> дней
                              <button type="submit">Сохранить</button>
              </p>
            </form>
    
            <table className="table">
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
                      onEditData06={this.onEditData06}
                      onEditData07={this.onEditData07}
                      onEditData09={this.onEditData09}
                      onEditData10={this.onEditData10}
                      onEditData12={this.onEditData12}
                      onRemoveEquipment={this.onRemoveEquipment}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">
                      Нет ИО, требующих метрологической аттестации, 
                      и СИ, требующих поверки, калибровки в течение ближайших {period} дней.
                    </td>
                  </tr>
                )}
              
              </tbody>
            </table>
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
)(Equipments);

export {
  EquipmentItem,
  nextDate,
  nextCalibrationTime,
};
