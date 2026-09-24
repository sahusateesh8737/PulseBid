const { z } = require('zod');

exports.createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    startingPrice: z.number().min(0)
  })
});

exports.updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    startingPrice: z.number().min(0).optional(),
    status: z.enum(['available', 'archived']).optional()
  })
});

exports.createSeatsSchema = z.object({
  body: z.object({
    count: z.number().int().min(1).max(100)
  })
});
