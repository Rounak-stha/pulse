import { create } from 'zustand';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';

/**
 * Builder State Store
 * Manages sections array, selection, and mode with undo/redo support
 */
const useBuilderStore = create(
  temporal(
    (set, get) => ({
      // State
      sections: [],
      selectedSectionId: null,
      mode: 'edit', // 'edit' | 'preview'

      // Actions
      addSection: (section) => {
        const id = section.id || nanoid();
        const newSection = { ...section, id };
        
        set((state) => ({
          sections: [...state.sections, newSection],
          selectedSectionId: id
        }));
        
        return id;
      },

      insertSection: (section, index) => {
        const id = section.id || nanoid();
        const newSection = { ...section, id };
        
        set((state) => {
          const sections = [...state.sections];
          sections.splice(index, 0, newSection);
          return {
            sections,
            selectedSectionId: id
          };
        });
        
        return id;
      },

      updateSection: (id, updates) => {
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id
              ? { ...section, ...updates }
              : section
          )
        }));
      },

      updateSectionSettings: (id, settingsUpdates) => {
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id
              ? {
                  ...section,
                  settings: { ...section.settings, ...settingsUpdates }
                }
              : section
          )
        }));
      },

      removeSection: (id) => {
        set((state) => ({
          sections: state.sections.filter((section) => section.id !== id),
          selectedSectionId:
            state.selectedSectionId === id ? null : state.selectedSectionId
        }));
      },

      reorderSections: (fromIndex, toIndex) => {
        set((state) => {
          const sections = [...state.sections];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          return { sections };
        });
      },

      duplicateSection: (id) => {
        const section = get().sections.find((s) => s.id === id);
        if (!section) return null;

        const newId = nanoid();
        const duplicated = {
          ...section,
          id: newId,
          settings: { ...section.settings }
        };

        const index = get().sections.findIndex((s) => s.id === id);
        get().insertSection(duplicated, index + 1);
        
        return newId;
      },

      selectSection: (id) => {
        set({ selectedSectionId: id });
      },

      deselectSection: () => {
        set({ selectedSectionId: null });
      },

      setMode: (mode) => {
        set({ mode });
      },

      clearSections: () => {
        set({
          sections: [],
          selectedSectionId: null
        });
      },

      loadState: (state) => {
        set({
          sections: state.sections || [],
          selectedSectionId: state.selectedSectionId || null,
          mode: state.mode || 'edit'
        });
      },

      // Selectors (convenience methods)
      getSection: (id) => {
        return get().sections.find((section) => section.id === id);
      },

      getSectionIndex: (id) => {
        return get().sections.findIndex((section) => section.id === id);
      },

      getSelectedSection: () => {
        const { sections, selectedSectionId } = get();
        return sections.find((section) => section.id === selectedSectionId);
      },

      getSectionsCount: () => {
        return get().sections.length;
      }
    }),
    {
      // Zundo options for undo/redo
      limit: 50,
      equality: (a, b) => a === b,
      // Only track sections and selectedSectionId in history
      partialize: (state) => ({
        sections: state.sections,
        selectedSectionId: state.selectedSectionId
      })
    }
  )
);

export default useBuilderStore;