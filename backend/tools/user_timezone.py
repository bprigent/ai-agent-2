from smolagents import Tool

class UserTimezoneTool(Tool):
    name = "get_user_timezone"
    description = "Using the user IP, this tool returns the user's timezone"
    inputs = {}
    output_type = "string"

    def __init__(self):
        super().__init__()
        import logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

    def forward(self) -> str:
        # Get the user's timezone
        import requests
        import pytz

        try:
            # Get the user's IP address
            ip_response = requests.get('https://api.ipify.org?format=json')
            if ip_response.status_code != 200:
                return "UTC"  # Default to UTC if IP lookup fails
            
            ip_address = ip_response.json()['ip']

            # Get the user's timezone
            tz_response = requests.get(f'https://ipapi.co/{ip_address}/timezone/')
            if tz_response.status_code != 200:
                return "UTC"  # Default to UTC if timezone lookup fails
            
            timezone = tz_response.text.strip()  # Response is plain text
            
            # Validate the timezone
            if timezone in pytz.all_timezones:
                return timezone
            else:
                return "UTC"  # Default to UTC if invalid timezone
                
        except Exception as e:
            self.logger.error(f"Error getting timezone: {str(e)}")
            return "UTC"  # Default to UTC on any error
