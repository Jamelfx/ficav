import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch notifications for a specific role
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!role) {
      return NextResponse.json(
        { error: 'Rôle requis' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      recipientRole: role,
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Count unread
    const unreadCount = await db.notification.count({
      where: {
        recipientRole: role,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead, role } = body;

    if (markAllRead && role) {
      // Mark all notifications as read for a role
      await db.notification.updateMany({
        where: {
          recipientRole: role,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
    }

    if (notificationId) {
      // Mark single notification as read
      await db.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: 'Notification marquée comme lue' });
    }

    return NextResponse.json(
      { error: 'ID de notification ou rôle requis' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la notification' },
      { status: 500 }
    );
  }
}
