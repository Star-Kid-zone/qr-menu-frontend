
export interface PublicSlugEditorProps {
    workspaceId: number;
    currentSlug: string;
    onSaved: () => void | Promise<void>;
}

export type Availability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'unchanged' | 'error';
