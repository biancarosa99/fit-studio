import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

const AddLocation = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const handleLocationSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng);
    setCoordinates(latLng);
    setAddress(value);
  };

  return (
    <React.Fragment>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleLocationSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" })} />
            <div>
              {loading ? <div>...Loading </div> : null}
              {suggestions.map((suggestion) => (
                <div
                  {...getSuggestionItemProps(suggestion)}
                  key={suggestion.id}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </React.Fragment>
  );
};

export default AddLocation;
