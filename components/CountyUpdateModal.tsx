import React, { useState } from 'react';
import axios from '../utils/axios';

interface CountyUpdateModalProps {
  county: { id: string; name: string; color?: string; tag?: string };
  onClose: () => void;
  onUpdate: (updatedCounty: { id: string; color: string; tag: string }) => void;
}

const CountyUpdateModal: React.FC<CountyUpdateModalProps> = ({ county, onClose, onUpdate }) => {
  const [color, setColor] = useState(county.color || '#cccccc');
  const [tag, setTag] = useState(county.tag || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/counties/${county.id}`, { color, tag });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="modal">
      <h2>Update {county.name}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Tag:
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default CountyUpdateModal;