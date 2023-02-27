import { Request, Response } from 'express'
import config from '../../utils/config.js'
import { ensureUserRole } from '../../utils/user.js'

function getMongoID() {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16)).toLowerCase()
}

function getVersionDefinition(populated: boolean): any {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: [
      'model',
      'version',
      'metadata',
      'built',
      'managedApproved',
      'reviewerApproved',
      'state',
      'logs',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      model: getModelDefinition(false),
      version: {
        type: 'string',
        example: 'v1.0',
      },

      metadata: {
        example: {
          highLevelDetails: {
            tags: ['facebook', 'fasttext', 'NLP', 'language', 'language_identification', 'multilingual'],
            name: 'FastText Language Identification',
            modelInASentence: 'Performs language identification of words',
            modelOverview:
              'Performs language identification of words in utf-8, capable of recognizing up to 176 languages.',
            modelCardVersion: 'v1.0',
          },
          contacts: {
            uploader: 'user',
            reviewer: 'user',
            manager: 'user',
          },
          schemaRef: '/Minimal/General/v10',
          timeStamp: '2022-07-03T20:52:59.176Z',
        },
      },

      built: {
        type: 'boolean',
      },
      managerApproved: {
        type: 'string',
        enum: ['Accepted', 'Declined', 'No Response'],
      },
      reviewerApproved: {
        type: 'string',
        enum: ['Accepted', 'Declined', 'No Response'],
      },

      state: {
        example: {},
      },
      logs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            level: {
              type: 'string',
              example: 'info',
            },
            msg: {
              type: 'string',
              example: 'A log message',
            },
          },
        },
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getModelDefinition(populated: boolean) {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: ['schemaRef', 'uuid', 'parent', 'versions', 'latestVersion', 'createdAt', 'updatedAt'],
    properties: {
      schemaRef: {
        type: 'string',
        example: '/Minimal/General/v10',
      },
      uuid: {
        type: 'string',
        example: 'fasttext-language-identification-30v93x',
      },
      versions: {
        type: 'array',
        items: getVersionDefinition(false),
      },
      latestVersion: {
        example: {
          highLevelDetails: {
            tags: ['facebook', 'fasttext', 'NLP', 'language', 'language_identification', 'multilingual'],
            name: 'FastText Language Identification',
            modelInASentence: 'Performs language identification of words',
            modelOverview:
              'Performs language identification of words in utf-8, capable of recognizing up to 176 languages.',
            modelCardVersion: 'v1.0',
          },
          contacts: {
            uploader: 'user',
            reviewer: 'user',
            manager: 'user',
          },
          schemaRef: '/Minimal/General/v10',
          timeStamp: '2022-07-03T20:52:59.176Z',
        },
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getUserDefinition(populated: boolean) {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: ['id', 'email', 'roles', 'favourites', 'createdAt', 'updatedAt'],
    properties: {
      id: {
        type: 'string',
        example: 'user',
      },
      email: {
        type: 'string',
        example: 'user@example.com',
      },

      roles: {
        type: 'array',
        items: {
          type: 'string',
          example: 'admin',
        },
      },
      favourites: {
        type: 'array',
        items: getModelDefinition(false),
      },

      token: {
        type: 'string',
        example: 'bc34761d-1e20-4d2b-9bc1-74e9a87ed010',
      },
      data: {},

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getSchemaDefinition(populated: boolean) {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: ['name', 'reference', 'schema', 'use'],
    properties: {
      name: {
        type: 'string',
        example: 'Minimal Upload Schema v6',
      },
      reference: {
        type: 'string',
        example: '/Minimal/Upload/v6',
      },
      use: {
        type: 'string',
        enum: ['UPLOAD', 'DEPLOYMENT'],
      },

      schema: {
        example: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          definitions: {
            provenance: {
              type: 'string',
              enum: ['IN_HOUSE', 'THIRD_PARTY', 'OPEN_SOURCE'],
              enumNames: ['In House', 'Third Party', 'Open Source'],
            },
          },
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            timeStamp: {
              type: 'string',
              format: 'date-time',
            },
            schemaRef: {
              title: 'Schema reference',
              type: 'string',
            },
            highLevelDetails: {
              title: 'Overview',
              description: 'Summary of the model functionality.',
              type: 'object',
              properties: {
                name: {
                  title: 'Name of the Machine Learning Model',
                  description:
                    "This should be descriptive name, such as 'Arabic - English Translation', and will be visible in the model marketplace.",
                  type: 'string',
                  minLength: 1,
                  maxLength: 140,
                },
                modelInASentence: {
                  title: 'Summarise the model in a sentence',
                  description:
                    "This sentence will allow an individual to decide if they want to open the model card to read further Example: 'Takes Arabic text snippet inputs and outputs an English translation.'",
                  type: 'string',
                  minLength: 1,
                  maxLength: 140,
                },
                modelOverview: {
                  title: 'What does the model do?',
                  description: 'A description of what the model does.',
                  type: 'string',
                  minLength: 1,
                },
                modelCardVersion: {
                  type: 'string',
                  title: 'Model version',
                },
                tags: {
                  title: 'Descriptive tags for the model.',
                  description: 'These tags will be searchable and will help others find this model.',
                  type: 'array',
                  items: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                  },
                  uniqueItems: true,
                },
              },
              required: ['name', 'modelInASentence', 'modelOverview', 'modelCardVersion', 'tags'],
              additionalProperties: false,
            },
            contacts: {
              title: 'Contacts',
              description:
                'Details of those individuals responsible for the model, the detail in this card and the risk involved in using the model and its continued alignment with policy.',
              type: 'object',
              properties: {
                uploader: {
                  title: 'Model Developer.',
                  description:
                    'The individual who develops or leads the technical development of the ML model and implementation of ongoing technical actions highlighted in the model card.',
                  type: 'string',
                  minLength: 1,
                },
                reviewer: {
                  title: 'Model Technical Reviewer.',
                  description:
                    'An experienced data scientist, responsible for reviewing and checking technical information added to the model card by the Model Developer before approving the model for operational use.',
                  type: 'string',
                  minLength: 1,
                },
                manager: {
                  title: 'Senior Responsible Officer.',
                  description:
                    'A senior member of staff responsible for owning the ML model, associated legal, ethical and operational risk, and ensuring that the ML Model and its use is compliant with policy.',
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['uploader', 'reviewer', 'manager'],
              additionalProperties: false,
            },
          },
          required: ['timeStamp', 'highLevelDetails'],
        },
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getDeploymentDefinition(populated: boolean) {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: ['schemaRef', 'uuid', 'parent', 'versions', 'latestVersion', 'createdAt', 'updatedAt'],
    properties: {
      schemaRef: {
        type: 'string',
        example: '/Minimal/Deployment/v10',
      },
      uuid: {
        type: 'string',
        example: 'fasttext-language-deployment-30v93x',
      },

      model: getModelDefinition(false),
      versions: {
        type: 'array',
        items: getVersionDefinition(false),
      },
      metadata: {
        example: {
          highLevelDetails: {
            name: 'Example Production Deployment',
            endDate: {
              hasEndDate: true,
              date: '2022-11-16',
            },
            modelID: 'fasttext-language-identification-rjjic1',
          },
          contacts: {
            requester: 'user',
            secondPOC: 'user',
          },
          schemaRef: '/Minimal/Deployment/v6',
          user: 'user',
          timeStamp: '2022-06-28T13:33:28.870Z',
        },
      },

      managerApproved: {
        type: 'string',
        enum: ['Accepted', 'Declined', 'No Response'],
      },

      logs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            level: {
              type: 'string',
              example: 'info',
            },
            msg: {
              type: 'string',
              example: 'A log message',
            },
          },
        },
      },
      built: {
        type: 'boolean',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getApprovalDefinition(populated: boolean) {
  if (!populated) {
    return {
      type: 'string',
      example: getMongoID(),
    }
  }

  return {
    type: 'object',
    required: ['version', 'deployment', 'user', 'status', 'approvalType', 'approval', 'createdAt', 'updatedAt'],
    properties: {
      version: {
        type: 'string',
        nullable: true,
        example: getMongoID(),
      },
      deployment: {
        type: 'string',
        nullable: true,
        example: getMongoID(),
      },

      user: getUserDefinition(false),
      status: {
        type: 'string',
        enum: ['Accepted', 'Declined', 'No Response'],
        example: 'Accepted',
      },

      approvalType: {
        type: 'string',
        enum: ['Manager', 'Reviewer'],
        example: 'Manager',
      },
      approval: {
        type: 'string',
        enum: ['Upload', 'Deployment'],
        example: 'Upload',
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  }
}

function getUiConfigDefinition() {
  // Automatic generation
  const uiConfig = config.ui

  return parseValue(uiConfig)
}

function parseValue(value: any) {
  if (typeof value === 'string') {
    return {
      type: 'string',
      example: value,
    }
  }
  if (typeof value === 'boolean') {
    return {
      type: 'boolean',
      example: value,
    }
  }
  if (typeof value === 'object') {
    const parent: { type: string; properties: Record<string, any> } = {
      type: 'object',
      properties: {},
    }

    for (const [key, child] of Object.entries(value)) {
      parent.properties[key] = parseValue(child)
    }

    return parent
  }

  throw new Error(`Unexpected value ${value}`)
}

function generateSpecification() {
  return {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'Bailo API',
    },
    basePath: '/api/v1',
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
        name: 'model',
        description: 'A model is a reference to one or more versions',
      },
      {
        name: 'deployment',
        description: 'A deployment allows users to access one or more versions of a model',
      },
      {
        name: 'version',
        description: 'A version represents a single machine learning model and model card',
      },
      {
        name: 'schema',
        description: 'A schema is a template for an upload or deployment model card',
      },
      {
        name: 'approval',
        description: 'An approval is used to ask permission for a model / deployment',
      },
      {
        name: 'user',
        description: 'List and interact with users',
      },
      {
        name: 'config',
        description: 'Get and update the server configuration',
      },
    ],
    paths: {
      '/model': {
        post: {
          tags: ['model'],
          description: 'Uploads a model to the system',
          consumes: ['multipart/form-data'],
          parameters: [
            {
              name: 'mode',
              in: 'query',
              description: 'Whether this version is for a new model or an existing model',
              required: true,
              type: 'string',
              enum: ['newVersion', 'newModel'],
            },
            {
              name: 'modelUuid',
              in: 'query',
              description: "If mode is 'newVersion', the model to update.",
              required: false,
              type: 'string',
            },
            {
              name: 'metadata',
              in: 'formData',
              description: 'Model card for the uploaded model',
              type: 'object',
              default: {
                highLevelDetails: {
                  tags: ['facebook', 'fasttext', 'NLP', 'language', 'language_identification', 'multilingual'],
                  name: 'FastText Language Identification',
                  modelInASentence: 'Performs language identification of words',
                  modelOverview:
                    'Performs language identification of words in utf-8, capable of recognizing up to 176 languages.',
                  modelCardVersion: 'v1.0',
                },
                contacts: {
                  uploader: 'user',
                  reviewer: 'user',
                  manager: 'user',
                },
              },
            },
            {
              name: 'code',
              in: 'formData',
              description: 'Model code to upload',
              type: 'file',
            },
            {
              name: 'binary',
              in: 'formData',
              description: 'Model binary to upload',
              type: 'file',
            },
          ],
          responses: {
            '200': {
              description: 'The UUID of the uploaded model.',
              schema: {
                type: 'object',
                properties: {
                  uuid: {
                    type: 'string',
                    example: 'fasttext-language-identification-30v93x',
                  },
                },
              },
            },
          },
        },
      },
      '/models': {
        get: {
          tags: ['model'],
          description: 'List and search models',
          parameters: [
            {
              name: 'type',
              in: 'query',
              description: 'Filter based on model type',
              type: 'string',
              enum: ['favourites', 'user', 'all'],
            },
            {
              name: 'filter',
              in: 'query',
              description: 'Filter based on model card contents',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A list of models.',
              schema: {
                type: 'object',
                properties: {
                  models: {
                    type: 'array',
                    items: {
                      $ref: '#/definitions/Model',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/model/uuid/{uuid}': {
        get: {
          tags: ['model'],
          description: 'Get a model by UUID.  UUID is the user visible identifier of a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of model to fetch',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A single model.',
              schema: {
                $ref: '#/definitions/Model',
              },
            },
          },
        },
      },
      '/model/id/{id}': {
        get: {
          tags: ['model'],
          description: 'Get a model by ID.  ID is the internal database identifier of an item.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of model to fetch',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A single model.',
              schema: {
                $ref: '#/definitions/Model',
              },
            },
          },
        },
      },
      '/model/{uuid}/schema': {
        get: {
          tags: ['model'],
          description: 'Get the schema for a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of model to fetch the schema for',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A single schema.',
              schema: {
                $ref: '#/definitions/Schema',
              },
            },
          },
        },
      },
      '/model/{uuid}/versions': {
        get: {
          tags: ['model'],
          description: 'Get all versions for a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of model to fetch the versions for',
              type: 'string',
            },
            {
              name: 'logs',
              in: 'query',
              description: 'Set to true in order to display logs.',
              type: 'boolean',
            },
          ],
          responses: {
            '200': {
              description: 'An array of versions.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Version',
                },
              },
            },
          },
        },
      },
      '/model/{uuid}/version/{version}': {
        get: {
          tags: ['model'],
          description: 'Get a specific version of a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of model to fetch the version for',
              type: 'string',
            },
            {
              name: 'version',
              in: 'path',
              description: 'Version to fetch',
              type: 'string',
            },
            {
              name: 'logs',
              in: 'query',
              description: 'Set to true in order to display logs.',
              type: 'boolean',
            },
          ],
          responses: {
            '200': {
              description: 'A version.',
              schema: {
                $ref: '#/definitions/Version',
              },
            },
          },
        },
      },
      '/model/{uuid}/deployments': {
        get: {
          tags: ['model'],
          description: 'Get all deployments for a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of model to fetch the deployments for',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'An array of deployments.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Deployment',
                },
              },
            },
          },
        },
      },
      '/deployment': {
        post: {
          tags: ['deployment'],
          description: 'Requests a deployment of a model',
          parameters: [
            {
              name: 'deployment',
              in: 'body',
              description: 'Deployment model card',
              required: true,
              type: 'object',
              default: {
                schemaRef: '/Minimal/Deployment/v6',
                highLevelDetails: {
                  endDate: {
                    hasEndDate: false,
                  },
                  name: 'Test Deployment',
                  modelID: 'test-model-abcde',
                },
                contacts: {
                  requester: 'user',
                  secondPOC: 'user',
                },
              },
            },
          ],
          responses: {
            '200': {
              description: 'The UUID of the uploaded deployment.',
              schema: {
                type: 'object',
                properties: {
                  uuid: {
                    type: 'string',
                    example: 'fasttext-language-deployment-30v93x',
                  },
                },
              },
            },
          },
        },
      },
      '/deployment/{uuid}': {
        get: {
          tags: ['deployment'],
          description: 'Get a deployment by UUID.  UUID is the user visible identifier of a deployment.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of deployment to fetch',
              type: 'string',
            },
            {
              name: 'logs',
              in: 'query',
              description: 'Set to true in order to display logs.',
              type: 'boolean',
            },
          ],
          responses: {
            '200': {
              description: 'A single deployment.',
              schema: {
                $ref: '#/definitions/Deployment',
              },
            },
          },
        },
      },
      '/deployment/user/{id}': {
        get: {
          tags: ['deployment'],
          description: 'Get all deployments for a user.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of a user to fetch deployments for.',
              type: 'string',
            },
            {
              name: 'logs',
              in: 'query',
              description: 'Set to true in order to display logs.',
              type: 'boolean',
            },
          ],
          responses: {
            '200': {
              description: 'An array of deployments.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Deployment',
                },
              },
            },
          },
        },
      },
      '/deployment/{uuid}/reset-approvals': {
        post: {
          tags: ['deployment'],
          description: 'Reset all approvals for a deployment.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of deployment to reset approvals for.',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A deployment.',
              schema: {
                $ref: '#/definitions/Deployment',
              },
            },
          },
        },
      },
      '/deployment/{uuid}/version/{version}/raw/{fileType}': {
        get: {
          tags: ['deployment'],
          description: 'Download either the raw code or binary files for a model version',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of the deployment.',
              type: 'string',
            },
            {
              name: 'version',
              in: 'path',
              description: 'The name of the specific version.',
              type: 'string',
            },
            {
              name: 'fileType',
              in: 'path',
              description: 'Raw file to export',
              type: 'string',
              enum: ['code', 'binary'],
            },
          ],
          responses: {
            '200': {
              description: 'An archived file containing either the code of binary files of the version specified.',
            },
          },
        },
      },
      '/version/{id}': {
        get: {
          tags: ['version'],
          description: "Get a specific version by it's internal ID.",
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of version to get.',
              type: 'string',
            },
            {
              name: 'logs',
              in: 'query',
              description: 'Set to true in order to display logs.',
              type: 'boolean',
            },
          ],
          responses: {
            '200': {
              description: 'A version.',
              schema: {
                $ref: '#/definitions/Version',
              },
            },
          },
        },
        put: {
          tags: ['version'],
          description: 'Update a version.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of version to update.',
              type: 'string',
            },
            {
              name: 'metadata',
              in: 'formData',
              description: 'Model card for the uploaded model',
              type: 'object',
            },
          ],
          responses: {
            '200': {
              description: 'An updated version.',
              schema: {
                $ref: '#/definitions/Version',
              },
            },
          },
        },
        delete: {
          tags: ['version'],
          description:
            "Delete a specific version by it's internal ID. This will also delete any associated approvals, and also any model/deployment documents depending on how many versions are left.",
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of version to delete.',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'ID of the deleted version.',
              type: 'string',
            },
          },
        },
      },
      '/version/{id}/reset-approvals': {
        post: {
          tags: ['version'],
          description: 'Reset all approvals for a version.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of version to reset approvals for.',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'A version.',
              schema: {
                $ref: '#/definitions/Version',
              },
            },
          },
        },
      },
      '/version/{id}/rebuild': {
        post: {
          tags: ['version'],
          description: 'Attempt to rebuild a model.',
          parameters: [
            {
              name: 'uuid',
              in: 'path',
              description: 'UUID of version to rebuild the model of.',
              type: 'string',
            },
          ],
          responses: {
            '200': {
              description: 'Successfully rebuilt model.',
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Successfully created build job in upload queue',
                  },
                },
              },
            },
          },
        },
      },
      '/schemas': {
        get: {
          tags: ['schema'],
          description: 'Get all schemas for a given user case.',
          parameters: [
            {
              name: 'use',
              in: 'query',
              description: 'Schema use case.',
              type: 'string',
              required: true,
              enum: ['UPLOAD', 'DEPLOYMENT'],
            },
          ],
          responses: {
            '200': {
              description: 'An array of schemas.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Schema',
                },
              },
            },
          },
        },
        post: {
          tags: ['schema'],
          description: 'Upload a new schema',
          parameters: [
            {
              name: 'schema',
              in: 'body',
              description: 'Schema metadata',
              required: true,
              type: 'object',
              default: {
                name: '',
                reference: '',
                schema: {},
                use: 'UPLOAD',
              },
            },
          ],
          responses: {
            '200': {
              description: 'The name of the submitted schema.',
              schema: {
                type: 'string',
              },
            },
            '409': {
              description: 'Duplicated name or reference.',
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
      '/schemas/default': {
        get: {
          tags: ['schema'],
          description: 'Get the default schema for a given use case.',
          parameters: [
            {
              name: 'use',
              in: 'query',
              description: 'Schema use case.',
              type: 'string',
              required: true,
              enum: ['UPLOAD', 'DEPLOYMENT'],
            },
          ],
          responses: {
            '200': {
              description: 'A schema.',
              schema: {
                $ref: '#/definitions/Schema',
              },
            },
          },
        },
      },
      '/schemas/{ref}': {
        get: {
          tags: ['schema'],
          description: 'Get a schema by reference.',
          parameters: [
            {
              name: 'ref',
              in: 'path',
              description: 'Schema ref identifier.',
              type: 'string',
              required: true,
            },
          ],
          responses: {
            '200': {
              description: 'A schema.',
              schema: {
                $ref: '#/definitions/Schema',
              },
            },
          },
        },
      },
      '/config': {
        get: {
          tags: ['config'],
          description: 'Get the UI configuration.',
          responses: {
            '200': {
              description: 'The UI configuration.',
              schema: {
                $ref: '#/definitions/UiConfig',
              },
            },
          },
        },
      },
      '/users': {
        get: {
          tags: ['user'],
          description: 'Get all users.',
          responses: {
            '200': {
              description: 'An array of all users.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/User',
                },
              },
            },
          },
        },
      },
      '/user': {
        get: {
          tags: ['user'],
          description: 'Get the current user.',
          responses: {
            '200': {
              description: 'The current user.',
              schema: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
      },
      '/user/token': {
        post: {
          tags: ['user'],
          description: 'Regenerate the authentication token of the current user.',
          responses: {
            '200': {
              description: 'The new token.',
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    example: '63eded34-ad9e-4002-926b-4756fbab7c49',
                  },
                },
              },
            },
          },
        },
      },
      '/user/favourite/{id}': {
        post: {
          tags: ['user'],
          description: 'Set a model to be a users favourite.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of model to set as favourite.',
              type: 'string',
              required: true,
            },
          ],
          responses: {
            '200': {
              description: 'The new user object.',
              schema: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
      },
      '/user/unfavourite/{id}': {
        post: {
          tags: ['user'],
          description: 'Set a model to not be a users favourite.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of model to unfavourite.',
              type: 'string',
              required: true,
            },
          ],
          responses: {
            '200': {
              description: 'The new user object.',
              schema: {
                $ref: '#/definitions/User',
              },
            },
          },
        },
      },
      '/approvals': {
        get: {
          tags: ['approval'],
          description: 'List approvals for model uploads and deployments.',
          parameters: [
            {
              name: 'approvalCategory',
              in: 'query',
              description: 'Category of approval to fetch.',
              type: 'string',
              required: true,
              enum: ['Upload', 'Deployment'],
            },
            {
              name: 'filter',
              in: 'query',
              description: 'Filter based on current user, or system wide.',
              type: 'string',
              enum: ['all'],
            },
          ],
          responses: {
            '200': {
              description: 'An array of approvals.',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Approval',
                },
              },
            },
          },
        },
      },
      '/approvals/count': {
        get: {
          tags: ['approval'],
          description: 'Count number of approvals a user has.',
          responses: {
            '200': {
              description: 'The number of approvals for the user.',
              schema: {
                type: 'object',
                properties: {
                  count: {
                    type: 'integer',
                    example: 10,
                  },
                },
              },
            },
          },
        },
      },
      '/approval/{id}/respond': {
        post: {
          tags: ['approval'],
          description: 'Approve or decline an approval.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of approval to respond to.',
              type: 'string',
              required: true,
            },
            {
              name: 'body',
              in: 'body',
              description: 'Whether to accept or decline the approval.',
              type: 'object',
              properties: {
                choice: {
                  type: 'string',
                  required: true,
                  enum: ['Accepted', 'Declined'],
                },
              },
            },
          ],
          responses: {
            '200': {
              description: 'The number of approvals for the user.',
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Finished setting approval response',
                  },
                },
              },
            },
          },
        },
      },
    },
    definitions: {
      Model: getModelDefinition(true),
      Version: getVersionDefinition(true),
      User: getUserDefinition(true),
      Schema: getSchemaDefinition(true),
      Deployment: getDeploymentDefinition(true),
      Approval: getApprovalDefinition(true),
      UiConfig: getUiConfigDefinition(),
    },
  }
}

export const getSpecification = [
  ensureUserRole('user'),
  async (_req: Request, res: Response) => res.json(generateSpecification()),
]
