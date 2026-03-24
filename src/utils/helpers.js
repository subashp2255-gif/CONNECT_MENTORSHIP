import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '';
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatTime(date) {
  if (!date) return '';
  return format(new Date(date), 'hh:mm a');
}

export function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function truncate(str, n) {
  return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
}

export function getCompanyColor(company) {
  const map = {
    Google: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Microsoft: 'bg-green-500/15 text-green-400 border-green-500/30',
    Amazon: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Flipkart: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Razorpay: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    CRED: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Swiggy: 'bg-orange-600/15 text-orange-500 border-orange-600/30',
    Infosys: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
    Zoho: 'bg-red-500/15 text-red-400 border-red-500/30',
    Freshworks: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };
  return map[company] || 'bg-violet-500/15 text-violet-400 border-violet-500/30';
}

export function getRandomGradient() {
  const gradients = [
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}
