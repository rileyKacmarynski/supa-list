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
					id: string
					list_id: string
					created_by: string
					text: string
					order: number
					created_at: string
					completed: boolean
				}
				Insert: {
					id?: string
					list_id: string
					created_by: string
					text: string
					order?: number
					created_at?: string
					completed?: boolean
				}
				Update: {
					id?: string
					list_id?: string
					created_by?: string
					text?: string
					order?: number
					created_at?: string
					completed?: boolean
				}
			}
			lists: {
				Row: {
					id: string
					name: string
					created_at: string
					last_modified: string
					created_by: string
					contributors: string[]
				}
				Insert: {
					id?: string
					name: string
					created_at?: string
					last_modified?: string
					created_by: string
					contributors: string[]
				}
				Update: {
					id?: string
					name?: string
					created_at?: string
					last_modified?: string
					created_by?: string
					contributors?: string[]
				}
			}
			profiles: {
				Row: {
					id: string
					created_at: string
					avatar_color: string
					user_id: string | null
				}
				Insert: {
					id?: string
					created_at?: string
					avatar_color?: string
					user_id?: string | null
				}
				Update: {
					id?: string
					created_at?: string
					avatar_color?: string
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
