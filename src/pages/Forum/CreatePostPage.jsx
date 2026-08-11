import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../../components/ui/Button';
import MarkdownEditor from '../../components/forum/MarkdownEditor';
import TagInput from '../../components/ui/TagInput';
import toast from 'react-hot-toast';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, forumCategories, forumTags, createForumPost } = useStore();

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
  }

  // Redirect if suspended from forum
  if (currentUser?.forumSuspended) {
    toast.error('Your forum participation has been suspended.');
    navigate('/forum');
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState([]);
  const [codeBlock, setCodeBlock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation States
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!title.trim() || title.trim().length < 10) {
      tempErrors.title = 'Title must contain at least 10 characters';
    }
    if (!description.trim() || description.trim().length < 20) {
      tempErrors.description = 'Description must contain at least 20 characters';
    }
    if (!categoryId) {
      tempErrors.categoryId = 'Please select a discussion category';
    }
    if (tags.length === 0) {
      tempErrors.tags = 'At least one tag is required';
    }
    if (tags.length > 5) {
      tempErrors.tags = 'You can add a maximum of 5 tags';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the validation errors first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Append codeblock helper wrapper to description if provided
      let finalDescription = description;
      if (codeBlock.trim()) {
        finalDescription += `\n\n### Code Snippet\n\`\`\`javascript\n${codeBlock.trim()}\n\`\`\``;
      }
      
      const newPostId = await createForumPost({
        title: title.trim(),
        description: finalDescription,
        categoryId,
        tags,
        image: imageUrl.trim() || null
      });

      toast.success('Question published successfully! 🚀');
      navigate(`/forum/post/${newPostId}`);
    } catch (err) {
      toast.error(err.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tagSuggestions = forumTags.map(t => t.name);
  const activeCategories = forumCategories.filter(c => c.isActive);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 flex flex-col relative z-10">
      
      {/* Back Button & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ask a Question 🙋‍♂️
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Create Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-surface border border-border p-6 rounded-2xl shadow-xl">
          
          {/* Post Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">
              Question Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How should I start learning React?"
              className={`w-full rounded-xl bg-panel border px-4 py-3 text-sm text-white placeholder-text-dim focus:outline-none focus:ring-1 transition-all ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-500/20' 
                  : 'border-border focus:border-primary/50 focus:ring-primary/20'
              }`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full rounded-xl bg-panel border px-4 py-3 text-sm text-white focus:outline-none transition-all ${
                errors.categoryId 
                  ? 'border-red-500' 
                  : 'border-border focus:border-primary/50'
              }`}
            >
              <option value="" className="text-text-dim">-- Select a category --</option>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.id} className="text-white">
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Tag Selector */}
          <div className="space-y-1.5">
            <TagInput
              tags={tags}
              onChange={setTags}
              suggestions={tagSuggestions}
              label="Tags"
              required
              placeholder="Type tag and press Enter"
              error={errors.tags}
            />
            <p className="text-[10px] text-text-dim">Add up to 5 keywords related to your topic.</p>
          </div>

          {/* Rich Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              placeholder="Describe your question in detail. Provide code examples, requirements, error messages, and context..."
              minLength={20}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Extra Code Block (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">
              Separate Code Snippet (Optional)
            </label>
            <textarea
              value={codeBlock}
              onChange={(e) => setCodeBlock(e.target.value)}
              placeholder="Paste code or script here (will be wrapped in syntax highlighting)..."
              rows={5}
              className="w-full rounded-xl bg-panel border border-border p-3 text-sm text-white placeholder-text-dim font-mono focus:outline-none focus:border-primary/50 transition-colors resize-y"
            />
          </div>

          {/* Attachment Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">
              Attachment Image URL (Optional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://example.com/screenshot.jpg"
              className="w-full rounded-xl bg-panel border border-border px-4 py-3 text-sm text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Link to="/forum">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Publish Question
            </Button>
          </div>

        </form>

        {/* Right Side: Guide Info */}
        <aside className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-light" /> Writing Guidelines
            </h3>
            
            <ul className="space-y-2.5 text-xs text-text-muted leading-relaxed">
              <li className="flex gap-2">
                <span className="text-primary-light font-bold">1.</span>
                <span>Keep the title concise but specific (at least 10 chars).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-light font-bold">2.</span>
                <span>Select the category that best fits your topic to reach the right mentors.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-light font-bold">3.</span>
                <span>Provide relevant tags so other users can search it easily.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-light font-bold">4.</span>
                <span>Use the Markdown editor tabs to preview your question's design before publishing.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary-light font-bold">5.</span>
                <span>Be respectful and explain your problem clearly.</span>
              </li>
            </ul>
          </div>
        </aside>

      </div>

    </div>
  );
}
