"use server";

import dbConnect from "../mongoose";
import Message from "../models/message.model";
import { revalidatePath } from "next/cache";

export async function createMessage(formData: FormData) {
    try {
        await dbConnect();
        
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return { error: 'All fields are required' };
        }

        // Create new message
        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        revalidatePath('/about');
        return { success: 'Message sent successfully!' };

    } catch (error) {
        console.error('Error creating message:', error);
        return { error: 'Failed to send message. Please try again.' };
    }
}

export async function getAllMessages() {
    try {
        await dbConnect();
        
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .lean();

        return messages;

    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

export async function getMessageById(id: string) {
    try {
        await dbConnect();
        
        const message = await Message.findById(id).lean();
        
        if (!message) {
            return null;
        }

        return message;

    } catch (error) {
        console.error('Error fetching message:', error);
        return null;
    }
} 