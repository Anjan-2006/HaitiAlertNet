
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null | Error;
  data: {
    latitude: number;
    longitude: number;
  } | null;
}

const useGeolocation = (options?: PositionOptions) => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getPosition = () => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        error: new Error('Geolocation is not supported by your browser.'),
      }));
      return;
    }

    setState(prevState => ({ ...prevState, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error,
          data: null,
        });
      },
      options
    );
  };

  // Note: We are not calling getPosition automatically on mount.
  // The component using this hook should call getPosition when needed.
  // This avoids requesting permission immediately.

  return { ...state, getPosition };
};

export default useGeolocation;
