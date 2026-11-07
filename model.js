export function freshChecklist(seed) {
  return seed.map(room => ({
    ...room,
    sections: room.sections.map(section => ({
      ...section,
      tasks: section.tasks.map((name, index) => ({
        id: `seed-${section.id}-${index + 1}`,
        name,
        done: false,
      })),
    })),
  }));
}

function mergeTasks(tasks, savedTasks, sampleNames) {
  const remaining = new Map(tasks.map(task => [task.name, task]));
  const additions = savedTasks.filter(task => {
    const match = remaining.get(task.name);
    if (match) {
      match.done = task.done;
      remaining.delete(task.name);
      return false;
    }
    return sampleNames[task.id] !== task.name;
  });
  return [...tasks, ...additions];
}

export function upgradeSampleChecklist(savedRooms, seed, sampleTaskNames) {
  const rooms = freshChecklist(seed);
  const imported = rooms.map(room => {
    const saved = savedRooms.find(item => item.id === room.id);
    if (!saved) return room;

    const sections = room.sections.map(section => {
      const existing = saved.sections.find(item => item.id === section.id);
      if (!existing) return section;
      const sampleNames = sampleTaskNames[room.id]?.[section.id] ?? {};
      return { ...existing, tasks: mergeTasks(section.tasks, existing.tasks, sampleNames) };
    });
    const customSections = saved.sections.filter(section => !room.sections.some(item => item.id === section.id));
    return { ...saved, sections: [...sections, ...customSections] };
  });
  const customRooms = savedRooms.filter(room => !rooms.some(item => item.id === room.id));
  return [...imported, ...customRooms];
}

export function measure(tasks) {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const percent = done === 0 ? 0 : done === total ? 100 : Math.min(99, Math.max(1, Math.round(100 * done / total)));
  return { done, total, percent };
}

export function roomTasks(room) {
  return room.sections.flatMap(section => section.tasks);
}
