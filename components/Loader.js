import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';

import LoaderStyles from './LoaderStyles';

class Loader extends Component {
    render() {
        return (
            <View style={LoaderStyles.container}>
                <Text style={LoaderStyles.text}>Please wait...</Text>
                <ActivityIndicator
                    animating={true}
                    color="rgba(92, 99,216, 1)"
                    style={[{ height: 80 }]}
                    size="large"
                />
            </View>
        );
    }
}

Loader.propTypes = {
    navigation: PropTypes.object
};

export default Loader;