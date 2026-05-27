'use client';

import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Trash2, Plus, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Template {
  id: string;
  name: string;
  layout: string;
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  useEffect(() => {
    // Load templates on mount
    const savedTemplates = localStorage.getItem('metametrics-templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Failed to parse templates', e);
      }
    }
    
    // Load active template ID
    const activeId = localStorage.getItem('metametrics-current-template');
    if (activeId) {
      setActiveTemplateId(activeId);
    }
  }, []);

  const saveTemplatesToStorage = (newTemplates: Template[]) => {
    localStorage.setItem('metametrics-templates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleSaveAsNew = () => {
    const name = window.prompt('Enter a name for this dashboard template:');
    if (!name || !name.trim()) return;

    const currentLayout = localStorage.getItem('metametrics-layout-v3');
    if (!currentLayout) {
      alert('No custom layout to save! Move some cards first.');
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: name.trim(),
      layout: currentLayout,
    };

    const newTemplates = [...templates, newTemplate];
    saveTemplatesToStorage(newTemplates);
    localStorage.setItem('metametrics-current-template', newTemplate.id);
    setActiveTemplateId(newTemplate.id);
  };

  const handleUpdateCurrent = () => {
    if (!activeTemplateId) return;
    
    const currentLayout = localStorage.getItem('metametrics-layout-v3');
    if (!currentLayout) return;

    const newTemplates = templates.map(t => 
      t.id === activeTemplateId ? { ...t, layout: currentLayout } : t
    );
    saveTemplatesToStorage(newTemplates);
    alert('Template updated!');
  };

  const handleLoadTemplate = (template: Template) => {
    localStorage.setItem('metametrics-layout-v3', template.layout);
    localStorage.setItem('metametrics-current-template', template.id);
    setActiveTemplateId(template.id);
    window.location.reload();
  };

  const handleDeleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent triggering load
    if (!window.confirm('Delete this template?')) return;

    const newTemplates = templates.filter(t => t.id !== id);
    saveTemplatesToStorage(newTemplates);
    if (activeTemplateId === id) {
      localStorage.removeItem('metametrics-current-template');
      setActiveTemplateId(null);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('metametrics-layout-v3');
    localStorage.removeItem('metametrics-current-template');
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-card border border-border hover:bg-white/5 text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors outline-none">
        <LayoutTemplate size={16} />
        <span>Templates</span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 bg-card border-border text-slate-200">
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">Dashboard Templates</div>
        
        {templates.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-white/5" />
            {templates.map(t => (
              <DropdownMenuItem 
                key={t.id}
                onClick={() => handleLoadTemplate(t)}
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 focus:bg-white/5 group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {t.id === activeTemplateId ? (
                    <Check size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-[14px] shrink-0" /> // spacer
                  )}
                  <span className="truncate">{t.name}</span>
                </div>
                <button 
                  onClick={(e) => handleDeleteTemplate(e, t.id)}
                  className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1"
                >
                  <Trash2 size={14} />
                </button>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator className="bg-white/5" />

        <DropdownMenuItem 
          onClick={handleSaveAsNew}
          className="cursor-pointer hover:bg-white/5 focus:bg-white/5 gap-2"
        >
          <Plus size={14} />
          Save as New Template
        </DropdownMenuItem>
        
        {activeTemplateId && (
          <DropdownMenuItem 
            onClick={handleUpdateCurrent}
            className="cursor-pointer hover:bg-white/5 focus:bg-white/5 gap-2"
          >
            <Save size={14} />
            Update Current Template
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-white/5" />
        
        <DropdownMenuItem 
          onClick={handleReset}
          className="cursor-pointer text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-400 gap-2"
        >
          <Trash2 size={14} />
          Reset to Default Layout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
