import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Save, Trash2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showFooter?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  saveText?: string;
  deleteText?: string;
  cancelText?: string;
  isLoading?: boolean;
  customFooter?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showFooter = true,
  onSave,
  onDelete,
  saveText = 'Salvar',
  deleteText = 'Excluir',
  cancelText = 'Cancelar',
  isLoading = false,
  customFooter,
}) => {
  const getSizeClass = () => {
    const sizeClasses = {
      sm: 'sm:max-w-md',
      md: 'sm:max-w-lg',
      lg: 'sm:max-w-2xl',
      xl: 'sm:max-w-4xl',
      full: 'sm:max-w-7xl'
    };
    return sizeClasses[size];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={getSizeClass()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        {showFooter && (
          <DialogFooter>
            {customFooter ? (
              customFooter
            ) : (
              <div className="flex justify-between w-full">
                <div>
                  {onDelete && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onDelete}
                      disabled={isLoading}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {deleteText}
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    <X size={16} className="mr-2" />
                    {cancelText}
                  </Button>
                  {onSave && (
                    <Button
                      type="button"
                      onClick={onSave}
                      disabled={isLoading}
                    >
                      <Save size={16} className="mr-2" />
                      {isLoading ? 'Salvando...' : saveText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
