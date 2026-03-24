import { cn } from '../../utils/helpers';

const getCompanyColor = (company) => {
  const map = {
    Google: 'bg-green-500/15 text-green-400 border-green-500/30',
    Microsoft: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Amazon: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Flipkart: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Razorpay: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    CRED: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    Swiggy: 'bg-orange-600/15 text-orange-500 border-orange-600/30',
    Infosys: 'bg-blue-400/15 text-blue-300 border-blue-400/30',
    Zoho: 'bg-red-500/15 text-red-400 border-red-500/30',
    Freshworks: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  };
  return map[company] || 'bg-gray-500/15 text-gray-400 border-gray-500/30';
};

const getStatusColor = (status) => {
  const map = {
    upcoming: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    completed: 'bg-green-500/15 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return map[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30';
};

export default function Badge({ children, company, status, variant = 'default', className }) {
  let colorClass = 'bg-white/5 text-gray-300 border-white/10';
  
  if (company) {
    colorClass = getCompanyColor(company);
  } else if (status) {
    colorClass = getStatusColor(status);
  } else if (variant === 'primary') {
    colorClass = 'bg-primary/20 text-primary-light border-primary/30';
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', colorClass, className)}>
      {children}
    </span>
  );
}
