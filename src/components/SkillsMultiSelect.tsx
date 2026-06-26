import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

const PREDEFINED_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL',
  'Figma', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Next.js', 'Express',
  'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Flutter', 'Dart',
  'Firebase', 'Kotlin', 'Swift', 'Agile', 'Jira', 'Kanban', 'Tableau',
  'Illustrator', 'Photoshop', 'After Effects', 'GraphQL', 'Redis',
  'Go', 'Rust', 'C++', 'C#', '.NET', 'Angular', 'Vue.js', 'Svelte',
  'Kubernetes', 'Terraform', 'Jenkins', 'Selenium', 'Cypress',
];

interface SkillsMultiSelectProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsMultiSelect({ skills, onChange }: SkillsMultiSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const available = PREDEFINED_SKILLS
    .filter(s => !skills.includes(s))
    .filter(s => !query || s.toLowerCase().includes(query.toLowerCase()));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setQuery('');
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && query.trim()) {
      e.preventDefault();
      addSkill(query);
    }
    if (e.key === 'Backspace' && !query && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showCustomOption = query.trim() && !PREDEFINED_SKILLS.some(s => s.toLowerCase() === query.trim().toLowerCase()) && !skills.includes(query.trim());

  return (
    <div ref={containerRef} className="relative">
      {/* Chips + input area */}
      <div
        onClick={() => { inputRef.current?.focus(); setIsOpen(true); }}
        className={`p-3 bg-[#F9FAFB] border rounded-xl flex flex-wrap gap-2 items-center cursor-text transition-all ${
          isOpen
            ? 'border-primary ring-4 ring-primary/10'
            : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
        }`}
      >
        {skills.map(skill => (
          <span key={skill} className="px-3 py-1 text-[10px] font-bold bg-[#F4F5FA] text-primary border border-primary/10 rounded-full flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
            {skill}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}>
              <X className="w-3 h-3 text-[#9CA3AF] cursor-pointer hover:text-red-500 transition-colors" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[140px]">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={skills.length ? 'Add more skills...' : 'Search or type a skill...'}
            className="flex-1 bg-transparent text-[11px] font-bold focus:outline-none placeholder:text-[#9CA3AF] placeholder:font-normal py-1"
          />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (available.length > 0 || showCustomOption) && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xl shadow-black/5 max-h-[200px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {showCustomOption && (
            <button
              type="button"
              onClick={() => { addSkill(query); setIsOpen(true); }}
              className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors flex items-center gap-2 border-b border-[#F3F4F6]"
            >
              <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">+</span>
              Add "<span className="font-black">{query.trim()}</span>"
            </button>
          )}
          {available.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => { addSkill(skill); setIsOpen(true); }}
              className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-[#374151] hover:bg-[#F4F5FA] hover:text-primary transition-colors"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
