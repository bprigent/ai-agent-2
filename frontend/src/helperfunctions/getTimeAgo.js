// get the time ago from the date
export const getTimeAgo = (date) => {
    // Convert string date to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // check if the date is a valid date
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    // if the date is older than 7 days, return the date in the format of "Mar 10, 2025"
    if (dateObj < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        return "on " + dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const now = new Date();
    const seconds = Math.floor((now - dateObj) / 1000);

    // Handle future dates
    if (seconds < 0) {
        return 'just now';
    }

    // Time intervals in seconds
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    // Find the appropriate interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        
        if (interval >= 1) {
            // Handle singular/plural
            return interval === 1 
                ? `1 ${unit} ago`
                : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
}   