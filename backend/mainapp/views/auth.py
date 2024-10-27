# mainapp/views/auth.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import logout

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, 'Passwords do not match')
        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken')
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email already in use')
        else:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()

            # Automatically log the user in after registration
            login(request, user)
            return redirect('home')  # Redirect to the homepage after registration

    return render(request, 'mainapp/register.html')  # Replace with your registration template

def sign_in(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')  # Redirect to the homepage or dashboard after login
        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'mainapp/login.html')  # Replace with your login template

def sign_out(request):
    logout(request)
    return redirect('sign_in')  # Redirect to the login page after logout