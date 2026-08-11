import * as Dialog from '@radix-ui/react-dialog';
import { Trash2, X } from 'lucide-react';
import Button from '../ui/Button';

export default function DeleteConfirmationDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  title = 'Delete Content',
  description = 'Are you sure you want to delete this content? This action is irreversible.'
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90] transition-opacity" />
        <Dialog.Content className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm bg-surface border border-border rounded-3xl p-6 shadow-2xl animate-fadeUp">
          
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <Dialog.Title className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" /> {title}
            </Dialog.Title>
            <Dialog.Close className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors focus:outline-none">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="my-4">
            <p className="text-sm text-text-muted leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
