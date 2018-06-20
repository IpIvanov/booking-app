import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Card, Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ToggleSwitch from 'toggle-switch-react-native';
import Loader from './components/Loader';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      modalVisible: false,
      isLoading: true
    };
  }

  async componentDidMount() {
    this.getDevices().then(results => {
      this.setState({ devices: results, isLoading: false });
    });
  }

  async getDevices() {
    try {
      let response = await fetch(
        'https://immense-badlands-11357.herokuapp.com/api/devices'
      );
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async bookDevice(isAvailable, booker, device) {
    try {
      await fetch('https://immense-badlands-11357.herokuapp.com/api/device', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device,
          isAvailable,
          booker,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  showModal = (isOn, index) => {
    if (isOn) {
      this.index = index;
      this.setState({ modalVisible: true });
    } else {
      this._setBooker(index, '');
      this.bookDevice(true, '', this.state.devices[index].device);
    }
  };

  _setBooker = (index, name) => {
    const devicesCloned = this.state.devices;

    this.setState({
      devices: devicesCloned.map((u, i) => {
        if (i === index) {
          u.booker = name;
          return u;
        }

        return u;
      }),
      modalVisible: false
    });
  };

  _refreshData = () => {
    this.setState({ isLoading: true });
    this.getDevices().then(results => {
      this.setState({ devices: results, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <Card>
              <Input
                style={{ margin: 20 }}
                ref={(el) => { this.name = el; }}
                onChangeText={(name) => this.name = name}
                value={this.name}
                placeholder='Name & Team'
                maxLength={20}
                leftIcon={
                  <Icon
                    name='users'
                    size={24}
                    color='grey'
                  />
                }
              />
              <Button
                title="Save"
                titleStyle={{ fontWeight: "400" }}
                buttonStyle={{
                  backgroundColor: "rgba(92, 99,216, 1)",
                  width: 300,
                  height: 45,
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5
                }}
                containerStyle={{ marginTop: 20 }}
                onPress={() => {
                  if (typeof this.name === 'object' || this.name === '') {
                    return;
                  }
                  this._setBooker(this.index, this.name);
                  this.bookDevice(false, this.name, this.state.devices[this.index].device);
                }}
              />
            </Card>
          </Modal>
          <TouchableHighlight
            underlayColor="rgba(92, 99,216, 1)"
            activeOpacity={0.8}
            onPress={this._refreshData}>
            <Icon
              style={{ textAlign: "center", marginTop: 5, marginBottom: 5 }}
              name='refresh'
              size={30}
              color='white'
            />
          </TouchableHighlight>
          <ScrollView style={styles.list}>
            {
              this.state.devices.map((u, i) => {
                return (
                  <Card key={i}>
                    <View key={i} style={styles.device}>
                      <Image
                        style={{ width: 50, height: 70 }}
                        resizeMode="contain"
                        source={{ uri: u.avatar }}
                      />
                      <Text style={styles.name}>{u.device}</Text>
                      <Text style={{ color: 'black', fontWeight: '900', paddingRight: 5 }}>{u.booker}</Text>
                      <ToggleSwitch
                        isOn={!u.isAvailable}
                        onColor='red'
                        offColor='green'
                        size='small'
                        onToggle={(isOn) => this.showModal(isOn, i)}
                      />
                    </View>
                  </Card>

                );
              })
            }
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(92, 99,216, 1)',
    paddingTop: 25,
    paddingBottom: 25,
  },
  list: {
    flex: 1,
    backgroundColor: 'rgba(92, 99,216, 1)',
    paddingTop: 5,
    paddingBottom: 25,
  },
  device: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
