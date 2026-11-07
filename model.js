export function freshChecklist(seed) {
  return seed.map(room => ({
    ...room,
    sections: room.sections.map(section => ({
      ...section,
      tasks: section.tasks.map((name, index) => ({
        id: `${section.id}-${index + 1}`,
        name,
        done: false,
      })),
    })),
  }));
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
