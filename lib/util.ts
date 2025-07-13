export function generateCode() {
    let code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // You can include lowercase if you want

    for (let i = 0; i < 3; i++) { // Loop runs 3 times because we want 3 numbers and 3 characters
        const randomNum = Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length)); // Picks a random character
        code += randomNum.toString() + randomChar; // Appends number then character
    }

    return code;
}

// Session storage utilities for managing user votes
export interface UserVote {
    gameId: string;
    rankings: { [key: string]: string[] };
    votedAt: string;
    isEditing?: boolean;
    identity?: string; // Add identity field for restrictive mode
}

export function hasUserVoted(gameId: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const voteKey = `game_vote_${gameId}`;
    const existingVote = sessionStorage.getItem(voteKey);
    return existingVote !== null;
}

export function saveUserVote(gameId: string, rankings: { [key: string]: string[] }, identity?: string): void {
    if (typeof window === 'undefined') return;
    
    const voteKey = `game_vote_${gameId}`;
    const hadPreviousVote = hasUserVoted(gameId);
    const existingVote = getUserVote(gameId);
    
    const voteData: UserVote = {
        gameId,
        rankings,
        votedAt: hadPreviousVote ? existingVote?.votedAt || new Date().toISOString() : new Date().toISOString(),
        isEditing: hadPreviousVote,
        identity: identity || existingVote?.identity // Preserve original identity if editing
    };
    
    sessionStorage.setItem(voteKey, JSON.stringify(voteData));
}

export function getUserVote(gameId: string): UserVote | null {
    if (typeof window === 'undefined') return null;
    
    const voteKey = `game_vote_${gameId}`;
    const voteData = sessionStorage.getItem(voteKey);
    
    if (!voteData) return null;
    
    try {
        return JSON.parse(voteData) as UserVote;
    } catch (error) {
        console.error('Error parsing user vote from session storage:', error);
        return null;
    }
}

export function clearUserVote(gameId: string): void {
    if (typeof window === 'undefined') return;
    
    const voteKey = `game_vote_${gameId}`;
    sessionStorage.removeItem(voteKey);
}

export function isUserEditingVote(gameId: string): boolean {
    const userVote = getUserVote(gameId);
    return userVote?.isEditing || false;
}