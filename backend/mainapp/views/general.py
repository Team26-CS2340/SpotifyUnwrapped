from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
import json
from django.views.decorators.csrf import csrf_protect

# View for rendering the contact page (GET request)
def contact_developers(request):
    """Render the contact form page."""
    return render(request, 'contact_form.html')  # Ensure 'contact_form.html' exists in your templates directory

# API view for handling feedback (POST request)
@csrf_protect  # Ensure CSRF protection
def api_contact_developers(request):
    print([settings.DEVELOPER_EMAIL])
    """Handle the POST request for feedback submission."""
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')

            # Check if all required fields are provided
            if not name or not email or not message:
                return JsonResponse({"message": "All fields are required!"}, status=400)

            # Send the feedback email to the developers
            subject = f"Feedback from {name}"  # Email subject with the sender's name
            body = f"Name: {name}\nEmail: {email}\nMessage:\n{message}"

            send_mail(
                subject,  # Subject of the email
                body,     # Body of the email (the feedback message)
                email,    # From email (sender's email)
                [settings.DEVELOPER_EMAIL],  # Recipient email (developer's email from settings.py)
                fail_silently=False,  # Set to False to raise an error if email sending fails
            )

            return JsonResponse({"message": "Feedback submitted successfully!"}, status=200)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)

    return JsonResponse({"message": "Only POST method allowed."}, status=405)
