import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function AutoSaveIndicator({ status = 'idle' }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <AnimatePresence mode="wait">
        {status === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-yellow-400"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        )}
        {status === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-green-400"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
