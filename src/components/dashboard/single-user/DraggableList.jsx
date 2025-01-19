import { supabase } from '@/lib/supabase/client'

import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor,
  KeyboardSensor 
} from '@dnd-kit/core'
import { 
  SortableContext, 
  arrayMove,
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable'

export function DraggableList({ items, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {/* Your sortable items here */}
      </SortableContext>
    </DndContext>
  )
}
