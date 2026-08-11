import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border bg-surface p-8 text-center"
    >
      <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
        <Icon className="w-8 h-8 text-primary-light" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-text-muted mt-2 mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
