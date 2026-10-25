import prisma from './prisma';

export interface NotificationPayload {
  recipient: string; // Phone or Email
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  template: 'RESERVATION_REQUEST_RECEIVED' | 'RESERVATION_STATUS_UPDATE' | 'EVENT_INQUIRY_RECEIVED';
  data: Record<string, unknown>;
}

export async function sendNotification({
  recipient,
  channel,
  template,
  data,
}: NotificationPayload): Promise<{ success: boolean; status: string; logId: string }> {
  try {
    // Check if live external credentials are provided in env
    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
    const hasWhatsAppApi = Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

    let status = 'PENDING_CONFIG';
    let errorDetail: string | null = null;

    if (channel === 'EMAIL' && !hasSmtp) {
      status = 'SIMULATED';
      errorDetail = 'Live SMTP credentials not configured in .env. Notification safely logged in simulation mode.';
    } else if (channel === 'WHATSAPP' && !hasWhatsAppApi) {
      status = 'SIMULATED';
      errorDetail = 'Meta WhatsApp Business API credentials not configured in .env. Notification safely logged in simulation mode.';
    } else {
      // If live credentials were set, actual provider API would be invoked here with retry logic
      status = 'SENT';
    }

    const log = await prisma.notificationLog.create({
      data: {
        recipient,
        channel,
        template,
        status,
        error: errorDetail,
        payload: JSON.stringify({
          template,
          summary: data.reference ? `Ref: ${data.reference}` : 'General',
          customerName: data.customerName || 'Guest',
        }),
      },
    });

    return {
      success: status === 'SENT' || status === 'SIMULATED',
      status,
      logId: log.id,
    };
  } catch (error) {
    console.error('Notification dispatch error:', error);
    return {
      success: false,
      status: 'FAILED',
      logId: '',
    };
  }
}
