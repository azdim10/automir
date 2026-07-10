export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          meta_title: string | null
          meta_description: string | null
          is_published: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          id: string
          bucket_id: string
          path: string
          public_url: string
          alt: string
          width: number | null
          height: number | null
          mime_type: string | null
          size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          bucket_id?: string
          path: string
          public_url: string
          alt: string
          width?: number | null
          height?: number | null
          mime_type?: string | null
          size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          bucket_id?: string
          path?: string
          public_url?: string
          alt?: string
          width?: number | null
          height?: number | null
          mime_type?: string | null
          size_bytes?: number | null
          created_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          id: string
          page_id: string
          type: string
          sort_order: number
          payload: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          page_id: string
          type: string
          sort_order?: number
          payload?: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          page_id?: string
          type?: string
          sort_order?: number
          payload?: Json
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'page_sections_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'pages'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_asset_id: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_asset_id?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_asset_id?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'categories_image_asset_id_fkey'
            columns: ['image_asset_id']
            isOneToOne: false
            referencedRelation: 'media_assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          id: string
          slug: string
          category_id: string
          name: string
          short_description: string | null
          description: string | null
          price: number
          old_price: number | null
          currency: string
          sku: string
          stock_quantity: number
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          category_id: string
          name: string
          short_description?: string | null
          description?: string | null
          price: number
          old_price?: number | null
          currency: string
          sku: string
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          category_id?: string
          name?: string
          short_description?: string | null
          description?: string | null
          price?: number
          old_price?: number | null
          currency?: string
          sku?: string
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          asset_id: string | null
          url: string
          alt: string
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          asset_id?: string | null
          url: string
          alt: string
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          asset_id?: string | null
          url?: string
          alt?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'media_assets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_attributes: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          value: string
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          value?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'product_attributes_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          id: string
          status: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string | null
          total_amount: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          status?: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address?: string | null
          total_amount: number
          currency: string
          created_at?: string
        }
        Update: {
          id?: string
          status?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          delivery_address?: string | null
          total_amount?: number
          currency?: string
          created_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_sku?: string
          quantity?: number
          unit_price?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type TableName = keyof Database['public']['Tables']

export type TableRow<TTableName extends TableName> =
  Database['public']['Tables'][TTableName]['Row']

export type TableInsert<TTableName extends TableName> =
  Database['public']['Tables'][TTableName]['Insert']

export type TableUpdate<TTableName extends TableName> =
  Database['public']['Tables'][TTableName]['Update']
