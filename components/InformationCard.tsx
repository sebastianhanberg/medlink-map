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

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {isEditing ? (
        <>
          <Input
            name="name"
            value={editedLocation.name}
            onChange={handleChange}
            className="mb-2"
          />
          <Textarea
            name="additionalInfo"
            value={editedLocation.additionalInfo || ''}
            onChange={handleChange}
            className="mb-2"
          />
          <Button onClick={handleSave}>Spara</Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{location.name}</h2>
          <p className="text-sm text-gray-600">{location.isRegion ? 'Region' : 'Kommun'}</p>
          <p className={`font-bold ${location.hasAgreement ? 'text-teal-700' : 'text-red-500'}`}>
            {location.hasAgreement ? 'Har avtal' : 'Inget avtal'}
          </p>
          {location.additionalInfo && <p className="mb-2">{location.additionalInfo}</p>}
          <Button onClick={handleEdit}>Ändra</Button>
        </>
      )}
    </div>
  );
};

export default InformationCard;
