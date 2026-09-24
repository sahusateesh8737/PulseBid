const { z } = require('zod');

exports.createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    orgName: z.string().min(2),
    industry: z.string().optional()
  })
});

exports.joinOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    inviteCode: z.string().min(5)
  })
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

exports.inviteSchema = z.object({
  body: z.object({
    role_to_assign: z.string().min(1),
    expiresInDays: z.number().positive()
  })
});
