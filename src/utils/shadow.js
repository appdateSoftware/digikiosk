import {Platform} from 'react-native';

export const shadowBottom = {
  borderBottomWidth: 1,
  borderColor: 'rgba(173, 181, 189, 0.2)',
};

export const shadowTabBar = Platform.select({
  android: {
    elevation: 10,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 0,
  },
});

export const shadowDefault = Platform.select({
  android: {
    elevation: 0.5,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});

export const shadowSecondary = Platform.select({
  android: {
    elevation: 10,
  },
  ios: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
});
