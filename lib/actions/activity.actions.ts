"use server"
import Activity from "../models/activity.model";
import dbConnect from "../mongoose";



export async function logActivity(
    update: string,     
    actionType: string, 
    gameId?: string, 
    metadata?: Record<string, unknown>
) {
    try {
        await dbConnect();
        
        await Activity.create({
            update,
            time: new Date(),
            gameId,
            actionType,
            metadata
        });
        
        console.log(`Activity logged: ${update}`);
    } catch (error: unknown) {
        console.error('Error logging activity:', error);
        // Don't throw error to prevent breaking main functionality
    }
}

export async function fetchRecentActivities(limit: number = 50) {
    try {
        await dbConnect();
        
        const activities = await Activity.find({})
            .sort({ time: -1 }) // Most recent first
            .limit(limit)
            .lean();
        
        return activities.map(activity => ({
            update: activity.update,
            time: activity.time.toISOString(),
            gameId: activity.gameId,
            actionType: activity.actionType,
            metadata: activity.metadata,
            createdAt: activity.createdAt?.toISOString(),
        }));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(errorMessage);
    }
}

export async function fetchActivitiesByGame(gameId: string, limit: number = 20) {
    try {
        await dbConnect();
        
        const activities = await Activity.find({ gameId })
            .sort({ time: -1 }) // Most recent first
            .limit(limit)
            .lean();
        
        return activities.map(activity => ({
            update: activity.update,
            time: activity.time.toISOString(),
            gameId: activity.gameId,
            actionType: activity.actionType,
            metadata: activity.metadata,
            createdAt: activity.createdAt?.toISOString(),
        }));
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(errorMessage);
    }
}

export async function getActivityStats() {
    try {
        await dbConnect();
        
        const totalActivities = await Activity.countDocuments();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayActivities = await Activity.countDocuments({
            time: { $gte: todayStart }
        });
        
        const actionTypeCounts = await Activity.aggregate([
            {
                $group: {
                    _id: "$actionType",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        return {
            totalActivities,
            todayActivities,
            actionTypeCounts
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(errorMessage);
    }
}

export async function clearOldActivities(daysOld: number = 30) {
    try {
        await dbConnect();
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const result = await Activity.deleteMany({
            time: { $lt: cutoffDate }
        });
        
        return {
            success: true,
            deletedCount: result.deletedCount,
            message: `Cleared ${result.deletedCount} activities older than ${daysOld} days`
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(errorMessage);
    }
} 