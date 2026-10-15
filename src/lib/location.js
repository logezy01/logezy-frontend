export function requestBrowserCoordinates() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 0 }
    );
  });
}
