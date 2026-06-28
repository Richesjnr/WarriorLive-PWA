import React, { useState } from 'react';
import { Users, MessageSquare, Heart, Share2, Send } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  likes: number;
  timeAgo: string;
  tags: string[];
}

export default function CommunityView() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah M.',
      avatarColor: 'bg-indigo-500',
      content: 'Just had my 6-month checkup. Hemoglobin is stable! Remember to drink your water today, warriors. Hydration is everything. 💧',
      likes: 24,
      timeAgo: '2 hours ago',
      tags: ['Hydration', 'Milestone']
    },
    {
      id: '2',
      author: 'Marcus J.',
      avatarColor: 'bg-emerald-500',
      content: 'Experiencing some mild joint pain with this weather change. Using my heating pad and resting. What do you all do when the cold front hits?',
      likes: 18,
      timeAgo: '5 hours ago',
      tags: ['Weather', 'Pain Management']
    },
    {
      id: '3',
      author: 'Elena R.',
      avatarColor: 'bg-rose-500',
      content: 'Celebrating 1 year crisis-free since starting the new therapy protocol! So thankful for this community\'s support during the hard days.',
      likes: 56,
      timeAgo: '1 day ago',
      tags: ['Celebration', 'Therapy']
    }
  ]);
  
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      avatarColor: 'bg-slate-800',
      content: newPost,
      likes: 0,
      timeAgo: 'Just now',
      tags: ['Warrior Update']
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="community_view_section">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="font-sans font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Warrior Community
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Connect, share, and support fellow SCD warriors. You are not alone in this fight.
        </p>
      </div>

      {/* Post Creation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <form onSubmit={handlePostSubmit} className="flex gap-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm">
            Y
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share an update, ask a question, or encourage others..."
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-800 dark:text-slate-200"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${post.avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-200">{post.author}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{post.timeAgo}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {post.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-6">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors text-xs font-semibold cursor-pointer group"
              >
                <Heart className="h-4 w-4 group-hover:fill-current" />
                <span>{post.likes} Likes</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors text-xs font-semibold cursor-pointer">
                <MessageSquare className="h-4 w-4" />
                <span>Reply</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors text-xs font-semibold cursor-pointer">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
