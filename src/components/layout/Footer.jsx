import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Linkedin, Github } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Footer() {
  const { role } = useStore();
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CoNnEcT" className="w-16 h-16 object-contain" />
              <span className="text-2xl font-brand bg-gradient-brand bg-clip-text text-transparent tracking-widest uppercase">
                CoNnEcT
              </span>
            </Link>
            <p className="text-text-muted max-w-sm leading-relaxed mb-6">
              Empowering students to reach their full potential through 1-on-1 mentorship with industry experts and college alumni.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-panel border border-border text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-panel border border-border text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-panel border border-border text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-3">
              {role !== 'mentor' && (
                <li><Link to="/mentors" className="text-text-muted hover:text-primary-light transition-colors">Find Mentors</Link></li>
              )}
              <li><Link to="/register" className="text-text-muted hover:text-primary-light transition-colors">Become a Mentor</Link></li>
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">How it Works</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary-light transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-dim">
            &copy; {new Date().getFullYear()} CoNnEcT. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-text-muted hover:text-white transition-colors">Support</a>
            <a href="#" className="text-text-muted hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
