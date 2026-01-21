import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HRMS API',
      version: '1.0.0',
      description: 'Human Resource Management System API'
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'] },
            department: { type: 'string' },
            position: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            checkIn: { type: 'string', format: 'date-time' },
            checkOut: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'] },
                    department: { type: 'string' },
                    position: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                      token: { type: 'string' }
                    }
                  }
                }
              }
            },
            400: { description: 'Email already registered' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                      token: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Current user data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            401: { description: 'Not authenticated' }
          }
        }
      },
      '/employees': {
        get: {
          tags: ['Employees'],
          summary: 'Get all employees (Admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of employees',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      employees: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            },
            403: { description: 'Not authorized' }
          }
        },
        post: {
          tags: ['Employees'],
          summary: 'Create employee (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' },
                    department: { type: 'string' },
                    position: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Employee created successfully' },
            400: { description: 'Email already registered' },
            403: { description: 'Not authorized' }
          }
        }
      },
      '/employees/{id}': {
        get: {
          tags: ['Employees'],
          summary: 'Get employee by ID (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Employee data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      employee: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            404: { description: 'Employee not found' }
          }
        },
        put: {
          tags: ['Employees'],
          summary: 'Update employee (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    department: { type: 'string' },
                    position: { type: 'string' },
                    role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Employee updated successfully' },
            404: { description: 'Employee not found' }
          }
        },
        delete: {
          tags: ['Employees'],
          summary: 'Delete employee (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Employee deleted successfully' },
            404: { description: 'Employee not found' }
          }
        }
      },
      '/attendance/check-in': {
        post: {
          tags: ['Attendance'],
          summary: 'Check in',
          security: [{ bearerAuth: [] }],
          responses: {
            201: {
              description: 'Checked in successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      attendance: { $ref: '#/components/schemas/Attendance' }
                    }
                  }
                }
              }
            },
            400: { description: 'Already checked in today' }
          }
        }
      },
      '/attendance/check-out': {
        post: {
          tags: ['Attendance'],
          summary: 'Check out',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Checked out successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      attendance: { $ref: '#/components/schemas/Attendance' }
                    }
                  }
                }
              }
            },
            400: { description: 'Must check in before checking out' }
          }
        }
      },
      '/attendance/my': {
        get: {
          tags: ['Attendance'],
          summary: 'Get own attendance history',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'startDate',
              in: 'query',
              schema: { type: 'string', format: 'date' }
            },
            {
              name: 'endDate',
              in: 'query',
              schema: { type: 'string', format: 'date' }
            }
          ],
          responses: {
            200: {
              description: 'Attendance history',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      attendance: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Attendance' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/attendance/today': {
        get: {
          tags: ['Attendance'],
          summary: 'Get today attendance status',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Today status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      attendance: { $ref: '#/components/schemas/Attendance' },
                      checkedIn: { type: 'boolean' },
                      checkedOut: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/attendance/report': {
        get: {
          tags: ['Attendance'],
          summary: 'Get attendance report (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'userId',
              in: 'query',
              schema: { type: 'string' }
            },
            {
              name: 'startDate',
              in: 'query',
              schema: { type: 'string', format: 'date' }
            },
            {
              name: 'endDate',
              in: 'query',
              schema: { type: 'string', format: 'date' }
            }
          ],
          responses: {
            200: {
              description: 'Attendance report',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      attendance: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Attendance' }
                      }
                    }
                  }
                }
              }
            },
            403: { description: 'Not authorized' }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);
