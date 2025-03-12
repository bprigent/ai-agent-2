from smolagents import Tool
from typing import Any

class GetCurrentDateAndTime(Tool):
    name = "get_current_date_and_time"
    description = "Gets the current date, day of the week, and time for the specified timezone."
    inputs = {
        "timezone": {
            "type": "string",
            "description": "Timezone (e.g., 'UTC', 'US/Pacific', 'Europe/London')",
            "required": True
        }
    }
    output_type = "string"

    def forward(self, timezone: str) -> str:
        import pytz
        from datetime import datetime

        if not isinstance(timezone, str) or not timezone.strip():
            raise ValueError("Timezone must be a non-empty string")

        try:
            tz = pytz.timezone(timezone)
            current = datetime.now(tz)
            return f"In {timezone}, it is {current.strftime('%A, %Y-%m-%d at %H:%M:%S')}"
        except pytz.exceptions.UnknownTimeZoneError:
            suggestions = [tz for tz in pytz.all_timezones if timezone.lower() in tz.lower()][:3]
            error_msg = f"Invalid timezone: '{timezone}'"
            if suggestions:
                error_msg += f". Did you mean: {', '.join(suggestions)}?"
            raise ValueError(error_msg)
        except Exception as e:
            raise ValueError(f"Error getting date and time: {str(e)}")