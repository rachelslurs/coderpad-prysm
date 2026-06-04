// Public API of @prysm/design-system — generic, context-agnostic primitives
// only. Domain-specific components live in the consuming app.

// Actions
export { Button } from "./Button";
export type { ButtonProps } from "./Button";

// Data display
export { Avatar } from "./Avatar";
export type { AvatarProps } from "./Avatar";
export { Badge } from "./Badge";
export type { BadgeProps } from "./Badge";
export { Card } from "./Card";
export type { CardProps } from "./Card";
export { IconTile } from "./IconTile";
export type { IconTileProps } from "./IconTile";
export { Field } from "./Field";
export type { FieldProps } from "./Field";
export { Section } from "./Section";
export type { SectionProps } from "./Section";
export { IconField } from "./IconField";
export type { IconFieldProps } from "./IconField";
export { SortIndicator } from "./SortIndicator";
export type { SortIndicatorProps } from "./SortIndicator";
export { ColumnHeader } from "./ColumnHeader";
export type { ColumnHeaderProps, SortDirection } from "./ColumnHeader";
export { TaskProgress } from "./TaskProgress";
export type { TaskProgressProps } from "./TaskProgress";
export { EntityCard } from "./EntityCard";
export type { EntityCardProps } from "./EntityCard";
export { EntityRow } from "./EntityRow";
export type { EntityRowProps } from "./EntityRow";

// Feedback
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";
export { Skeleton } from "./Skeleton";
export type { SkeletonProps } from "./Skeleton";
export { SyncStatus } from "./SyncStatus";
export type { SyncStatusProps, SyncState } from "./SyncStatus";

// Overlays
export { OverlayPanel } from "./OverlayPanel";
export type { OverlayPanelProps } from "./OverlayPanel";

// Navigation
export { AppBar } from "./AppBar";
export type { AppBarProps } from "./AppBar";

// Forms (structured inputs — react-aria-components)
export { Toggle } from "./Toggle";
export type { ToggleProps } from "./Toggle";
export { Segmented } from "./Segmented";
export type { SegmentedProps } from "./Segmented";
export { Stepper } from "./Stepper";
export type { StepperProps } from "./Stepper";
export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField";
export { TextInput } from "./TextInput";
export type { TextInputProps } from "./TextInput";
export { TextArea } from "./TextArea";
export type { TextAreaProps } from "./TextArea";
export { Select } from "./Select";
export type { SelectProps } from "./Select";

// Keyboard
export { Kbd } from "./Kbd";
export type { KbdProps } from "./Kbd";

// Layout (Every Layout primitives — structural, context-agnostic)
export { Box } from "./Box";
export type { BoxProps } from "./Box";
export { Center } from "./Center";
export type { CenterProps } from "./Center";
export { Cover } from "./Cover";
export type { CoverProps } from "./Cover";
export { Sidebar } from "./Sidebar";
export type { SidebarProps, SideWidth, ContentMin } from "./Sidebar";
export { InlineIcon } from "./InlineIcon";
export type { InlineIconProps } from "./InlineIcon";
export { Container } from "./Container";
export type { ContainerProps } from "./Container";

// Helpers + types
export { toInitials } from "./lib/toInitials";
export type { Tone } from "./types";
// Layout scale tokens (the scale-key prop types the layout primitives accept)
export type { Space, BorderWidth, Measure, MinHeight } from "./lib/scale";
