from typing import Dict, Optional, List
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pydantic import EmailStr
import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

class EmailService:
    def __init__(self):
        self.configuration = sib_api_v3_sdk.Configuration()
        self.configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
        self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(self.configuration))
        
        # Initialize Jinja2 environment
        template_dir = Path(__file__).parent.parent / 'templates' / 'email'
        self.jinja_env = Environment(loader=FileSystemLoader(template_dir))
    
    def send_invite_mail(self, to_email: EmailStr, invite_token: str) -> bool:
        """Send a welcome email to newly registered users."""
        try:
            subject = "Willkommen bei Bchat!"
            sender = {"name": "Bchat", "email": os.getenv('SENDER_EMAIL', 'noreply@beyondtheloop.ai')}
            to = [{"email": to_email}]
            
            # Load and render the template
            template = self.jinja_env.get_template('invitation-mail.html')
            html_content = template.render(
                activation_link=os.getenv('BACKEND_ADDRESS') + "/auth/" + invite_token,
            )
            
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=to,
                html_content=html_content,
                sender=sender,
                subject=subject
            )
            
            self.api_instance.send_transac_email(send_smtp_email)
            return True
            
        except ApiException as e:
            print(f"Exception when sending registration email: {e}")
            return False


    def send_custom_email(self, to_email: EmailStr, subject: str, html_content: str, 
                         recipient_name: Optional[str] = None) -> bool:
        """Send a custom email with specified content."""
        try:
            sender = {"name": "Beyond The Loop", "email": os.getenv('SENDER_EMAIL', 'noreply@beyondtheloop.com')}
            to = [{"email": to_email, "name": recipient_name or to_email}]
            
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=to,
                html_content=html_content,
                sender=sender,
                subject=subject
            )
            
            self.api_instance.send_transac_email(send_smtp_email)
            return True
            
        except ApiException as e:
            print(f"Exception when sending custom email: {e}")
            return False

    def send_budget_mail_80(self, to_email: EmailStr, recipient_name: Optional[str] = None) -> bool:
        """Send a warning email when budget reaches 80% of limit."""
        try:
            subject = "Abrechnungslimit fast erreicht"
            sender = {"name": "Beyond The Loop", "email": os.getenv('SENDER_EMAIL', 'noreply@beyondtheloop.ai')}
            to = [{"email": to_email, "name": recipient_name or to_email}]
            
            # Load and render the template
            template = self.jinja_env.get_template('budget-mail-80.html')
            html_content = template.render()
            
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=to,
                html_content=html_content,
                sender=sender,
                subject=subject
            )
            
            self.api_instance.send_transac_email(send_smtp_email)
            return True
            
        except ApiException as e:
            print(f"Exception when sending budget warning (80%) email: {e}")
            return False

    def send_budget_mail_100(self, to_email: EmailStr, recipient_name: Optional[str] = None) -> bool:
        """Send a critical warning email when budget reaches 100% of limit."""
        try:
            subject = "Achtung: Abrechnungslimit erreicht!"
            sender = {"name": "Beyond The Loop", "email": os.getenv('SENDER_EMAIL', 'noreply@beyondtheloop.ai')}
            to = [{"email": to_email, "name": recipient_name or to_email}]
            
            # Load and render the template
            template = self.jinja_env.get_template('budget-mail-100.html')
            html_content = template.render()
            
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=to,
                html_content=html_content,
                sender=sender,
                subject=subject
            )
            
            self.api_instance.send_transac_email(send_smtp_email)
            return True
            
        except ApiException as e:
            print(f"Exception when sending budget warning (100%) email: {e}")
            return False
