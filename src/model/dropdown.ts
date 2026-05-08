import type { Component } from 'vue'

export interface DropdownItem {
  id: string | number
  text: string
  leftIcon?: Component
  rightIcon?: Component
  disabled?: boolean
  type: string
}

// New type for dropdown props
export interface DropdownProps {
  items: DropdownItem[]
  position?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  showCheckboxes?: boolean
  selectedItems?: Array<string | number>
  multiple?: boolean
}

// New type for dropdown emits
export interface DropdownEmits {
  (e: 'update:open', value: boolean): void
  (e: 'select', item: DropdownItem): void
  (e: 'select-multiple', items: Array<string | number>): void
  (e: 'close'): void
}
