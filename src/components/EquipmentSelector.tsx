import React from 'react';
import { availableEquipment } from '../data/mockRecipes';

interface EquipmentSelectorProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  selectedEquipment,
  onEquipmentChange
}) => {
  const toggleEquipment = (equipment: string) => {
    if (selectedEquipment.includes(equipment)) {
      onEquipmentChange(selectedEquipment.filter(item => item !== equipment));
    } else {
      onEquipmentChange([...selectedEquipment, equipment]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Available Cooking Equipment
      </label>
      
    <div className="flex flex-wrap gap-2">
  {availableEquipment.map((equipment) => (
    <button
      key={equipment}
      onClick={() => toggleEquipment(equipment)}
      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
        selectedEquipment.includes(equipment)
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-105'
          : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
      }`}
    >
      {equipment}
    </button>
  ))}
</div>

    </div>
  );
};