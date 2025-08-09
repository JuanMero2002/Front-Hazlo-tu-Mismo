// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  rol: 'admin' | 'moderador' | 'usuario';
  reputacion: number;
}

export interface Tag {
  id: number;
  nombre: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Attachment {
  id: number;
  question_id?: number;
  original_name: string;  // Cambiado de nombre_original
  file_name: string;
  file_path: string;      // Cambiado de ruta_archivo
  mime_type?: string;     // Cambiado de tipo_mime
  file_size: number;      // Cambiado de tamaño
  file_type?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Answer {
  id: number;
  contenido: string;
  contenido_markdown?: string;
  es_mejor_respuesta?: boolean;
  votos?: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: number;
  titulo: string;
  contenido: string;
  contenido_markdown?: string;
  estado?: 'abierta' | 'resuelta' | 'cerrada';
  votos?: number;
  vistas?: number;
  user: User;
  category: Category;
  tags: Tag[];
  answers?: Answer[];
  attachments?: Attachment[];
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: number;
  motivo: string;
  descripcion?: string;
  estado: 'pendiente' | 'revisado' | 'descartado';
  reportable_type: string;
  reportable_id: number;
  user: User;
  created_at: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  question_id: number;
  question?: Question;
  created_at: string;
}
