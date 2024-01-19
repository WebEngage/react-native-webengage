import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

interface HeaderMoreButtonProps {
  toggleMenu?: () => void;
}

const HeaderMoreButton: FC<HeaderMoreButtonProps> = ({
  toggleMenu = () => null,
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
        <Image
          source={require('../Assets/images/more.png')}
          style={styles.moreIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  moreIcon: {
    height: 40,
    width: 40,
  },
  menuIcon: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default HeaderMoreButton;
