import SchemaModel, { Schema } from '../models/Schema.js'
import { SerializerOptions } from '../utils/serializers.js'

export function serializedSchemaFields(): SerializerOptions {
  return {
    mandatory: ['_id', 'reference', 'name', 'use'],
  }
}

export async function findSchemaByRef(ref: string) {
  const schema = await SchemaModel.findOne({
    reference: ref,
  })

  return schema
}

export async function findSchemaByName(name: string) {
  const schema = await SchemaModel.findOne({
    name,
  })

  return schema
}

export async function findSchemasByUse(use: string, limit?: number) {
  const baseSchemas = SchemaModel.find({ use }).sort({ createdAt: -1 })
  if (limit) baseSchemas.limit(limit)

  return baseSchemas
}

export async function createSchema(schema: Schema, overwrite = false) {
  if (overwrite) {
    await SchemaModel.deleteOne({ reference: schema.reference })
  }

  const schemaDoc = new SchemaModel(schema)

  return schemaDoc.save()
}
