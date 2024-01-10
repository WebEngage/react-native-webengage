import {NavigationContainerRef} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef>();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export const reset = (name: string, params: any) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name, params}],
  });
};

// Add more navigation functions as needed
