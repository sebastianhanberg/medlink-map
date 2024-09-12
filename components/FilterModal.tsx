import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: { nationella: boolean; ingetAvtal: boolean };
  setFilters: React.Dispatch<
    React.SetStateAction<{ nationella: boolean; ingetAvtal: boolean }>
  >;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nationella"
              checked={filters.nationella}
              onCheckedChange={(checked: boolean) =>
                setFilters((prev) => ({ ...prev, nationella: checked }))
              }
            />
            <Label htmlFor="nationella">Nationella</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ingetAvtal"
              checked={filters.ingetAvtal}
              onCheckedChange={(checked: boolean) =>
                setFilters((prev) => ({ ...prev, ingetAvtal: checked }))
              }
            />
            <Label htmlFor="ingetAvtal">Inget avtal</Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
