import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import EquipmentList from './EquipmentList';

class Equipments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      equipments: [],
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

  render() {
    const { equipments, loading } = this.state;

    return (
      <div>
        {loading && <div>Loading ...</div>}

        {equipments ? (
          <EquipmentList equipments={equipments} />
        ) : (
          <div>Нет ИО и СИ ...</div>
        )}
      </div>
    );
  }
}

export default withFirebase(Equipments);
