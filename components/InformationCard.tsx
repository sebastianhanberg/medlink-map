// import React, { useState, useEffect } from 'react';
// import { County } from '../types/County';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// interface InformationCardProps {
//   county: County;
//   onUpdate: (updatedCounty: County) => void;
//   onEditStateChange: (isEditing: boolean) => void;
// }

// const InformationCard: React.FC<InformationCardProps> = ({
//   county,
//   onUpdate,
//   onEditStateChange,
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedCounty, setEditedCounty] = useState(county);

//   useEffect(() => {
//     setEditedCounty(county);
//     setIsEditing(false);
//   }, [county]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     onEditStateChange(true);
//   };

//   const handleSave = async () => {
//     onUpdate(editedCounty);
//     setIsEditing(false);
//     onEditStateChange(false);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setEditedCounty({ ...editedCounty, [e.target.name]: e.target.value });
//   };

//   if (isEditing) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <Input
//           name="name"
//           value={editedCounty.name}
//           onChange={handleChange}
//           className="mb-2"
//         />
//         <Input
//           name="population"
//           type="number"
//           value={editedCounty.population}
//           onChange={handleChange}
//           className="mb-2"
//         />
//         <Input
//           name="area"
//           type="number"
//           value={editedCounty.area}
//           onChange={handleChange}
//           className="mb-2"
//         />
//         <Textarea
//           name="additionalInfo"
//           value={editedCounty.additionalInfo || ''}
//           onChange={handleChange}
//           className="mb-2"
//         />
//         <Button onClick={handleSave}>Save</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-2">{county.name}</h2>
//       <p className="mb-2">Population: {county.population}</p>
//       <p className="mb-2">Area: {county.area} km²</p>
//       <p className="mb-2">{county.isRegion ? 'Region' : 'County'}</p>
//       <p className="font-bold mb-2">
//         {county.hasAgreement ? 'Har avtal' : 'Inget avtal'}
//       </p>
//       {county.additionalInfo && <p className="mb-2">{county.additionalInfo}</p>}
//       <Button onClick={handleEdit}>Edit</Button>
//     </div>
//   );
// };

// export default InformationCard;

import React, { useState, useEffect } from 'react';
import { County } from '../types/County';
import { Kommun } from '../types/Kommun';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InformationCardProps {
  location: County | Kommun;
  onUpdate: (updatedLocation: County | Kommun) => void;
  onEditStateChange: (isEditing: boolean) => void;
}

const InformationCard: React.FC<InformationCardProps> = ({
  location,
  onUpdate,
  onEditStateChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(location);

  useEffect(() => {
    setEditedLocation(location);
    setIsEditing(false);
  }, [location]);

  const handleEdit = () => {
    setIsEditing(true);
    onEditStateChange(true);
  };

  const handleSave = async () => {
    onUpdate(editedLocation);
    setIsEditing(false);
    onEditStateChange(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedLocation({ ...editedLocation, [e.target.name]: e.target.value });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          name="name"
          value={editedLocation.name}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          name="population"
          type="number"
          value={editedLocation.population}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          name="area"
          type="number"
          value={editedLocation.area}
          onChange={handleChange}
          className="mb-2"
        />
        <Textarea
          name="additionalInfo"
          value={editedLocation.additionalInfo || ''}
          onChange={handleChange}
          className="mb-2"
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{location.name}</h2>
      <p className="mb-2">Population: {location.population}</p>
      <p className="mb-2">Area: {location.area} km²</p>
      <p className="mb-2">{location.isRegion ? 'Region' : 'Kommun'}</p>
      <p className="font-bold mb-2">
        {location.hasAgreement ? 'Har avtal' : 'Inget avtal'}
      </p>
      {location.additionalInfo && <p className="mb-2">{location.additionalInfo}</p>}
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  );
};

export default InformationCard;
