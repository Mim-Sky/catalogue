import { type SchemaTypeDefinition } from 'sanity'
// Import all your schemas
import insects from './insects';
import classSchema from './classSchema';
import orderSchema from './orderSchema';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    insects,     
    classSchema, 
    orderSchema, 
  ],
};