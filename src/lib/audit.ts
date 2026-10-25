import prisma from './prisma';

export async function logAuditEvent({
  actorId,
  actorEmail,
  action,
  entityType,
  entityId,
  details,
}: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorEmail,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
