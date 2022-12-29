export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[]

export interface Database {
	public: {
		Tables: {
			list_items: {
				Row: {
					completed: boolean
					created_at: string
					created_by: string
					id: string
					list_id: string
					order: number
					text: string
				}
				Insert: {
					completed?: boolean
					created_at?: string
					created_by: string
					id?: string
					list_id: string
					order?: number
					text: string
				}
				Update: {
					completed?: boolean
					created_at?: string
					created_by?: string
					id?: string
					list_id?: string
					order?: number
					text?: string
				}
			}
			lists: {
				Row: {
					contributors: string[]
					created_at: string
					created_by: string
					id: string
					last_modified: string
					name: string
				}
				Insert: {
					contributors: string[]
					created_at?: string
					created_by: string
					id?: string
					last_modified?: string
					name: string
				}
				Update: {
					contributors?: string[]
					created_at?: string
					created_by?: string
					id?: string
					last_modified?: string
					name?: string
				}
			}
			profiles: {
				Row: {
					avatar_color: string
					created_at: string
					id: string
					user_id: string | null
				}
				Insert: {
					avatar_color?: string
					created_at?: string
					id?: string
					user_id?: string | null
				}
				Update: {
					avatar_color?: string
					created_at?: string
					id?: string
					user_id?: string | null
				}
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
	}
}
