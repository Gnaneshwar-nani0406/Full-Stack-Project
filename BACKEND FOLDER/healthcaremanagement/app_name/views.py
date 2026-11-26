from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Sum, Q
from .models import Appointment, User, Payment
import razorpay
from datetime import datetime, timedelta


# ------------------ BASIC APIs ------------------



@api_view(['GET'])
def get_users(request):
    users = User.objects.all().values()
    return Response(users)


def dashboard(request):
    """Render interactive dashboard with context data"""
    from .models import User, Appointment, Payment
    from django.db.models import Sum
    # Total users (registrations)
    total_users = User.objects.count()
    # Total appointments
    total_appointments = Appointment.objects.count()
    # Total canceled appointments
    canceled_appointments = Appointment.objects.filter(status__iexact='canceled').count()
    # Total payments (number of payments)
    total_payments = Payment.objects.count()
    # Total amount (sum of all payment amounts)
    total_amount = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
    # Doctors (unique doctor names from Appointment)
    doctors = Appointment.objects.values_list('doctor', flat=True).distinct()
    # Recent appointments (last 5)
    recent_appointments = Appointment.objects.order_by('-date', '-time')[:5]
    # Recent users (last 5)
    recent_users = User.objects.order_by('-id')[:5]

    context = {
        'total_users': total_users,
        'total_appointments': total_appointments,
        'canceled_appointments': canceled_appointments,
        'total_payments': total_payments,
        'total_amount': total_amount,
        'doctors': doctors,
        'recent_appointments': recent_appointments,
        'recent_users': recent_users,
    }
    return render(request, 'dashboard.html', context)


@api_view(['GET'])
def test_api(request):
    return Response({"message": "Backend is working successfully"})

# ------------------ APPOINTMENT FLOW ------------------

# STEP 1: SAVE APPOINTMENT (PENDING)
@api_view(['POST'])
def save_appointment(request):
    data = request.data

    appointment = Appointment.objects.create(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        doctor=data.get('doctor'),
        date=data.get('date'),
        time=data.get('time'),
        status="PENDING"
    )

    return Response({
        "message": "Appointment created. Proceed to payment",
        "appointment_id": appointment.id
    })


# STEP 2: OPTIONAL (you can keep or remove this)
@api_view(['POST'])
def payment_success(request):
    appointment_id = request.data.get('appointment_id')

    appointment = get_object_or_404(Appointment, id=appointment_id)

    appointment.status = "CONFIRMED"
    appointment.save()

    Payment.objects.create(
        name=appointment.name,
        email=appointment.email,
        amount=500,
        status="SUCCESS"
    )

    return Response({"message": "Payment successful & appointment confirmed"})


# ------------------ GET / DELETE ------------------

@api_view(['GET'])
def get_appointments(request):
    appointments = Appointment.objects.all().values()
    return Response(appointments)


@api_view(['DELETE'])
def cancel_appointment(request, id):
    appointment = get_object_or_404(Appointment, id=id)
    appointment.delete()
    return Response({"message": "Deleted successfully"})


# ------------------ AUTH ------------------

@api_view(['POST'])
def register_user(request):
    data = request.data

    if User.objects.filter(email=data.get('email')).exists():
        return Response({"error": "User already exists"}, status=400)

    User.objects.create(
        name=data.get('name'),
        email=data.get('email'),
        password=make_password(data.get('password'))
    )

    return Response({"message": "Registered successfully"})


@api_view(['POST'])
def login_user(request):
    data = request.data

    try:
        user = User.objects.get(email=data.get('email'))

        if check_password(data.get('password'), user.password):
            return Response({
                "message": "Login success",
                "user": user.email
            })
        else:
            return Response({"error": "Invalid password"}, status=400)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=400)


# ------------------ RAZORPAY ------------------

razorpay_client = razorpay.Client(auth=(
    "rzp_test_SeK9s5djtiNHXi",
    "mms3yrhEivq5d3RDbDfaWbg6"
))


@api_view(['POST'])
def create_order(request):
    amount = int(request.data.get('amount')) * 100

    order = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    })

    return Response(order)


# 🔥 FINAL PAYMENT VERIFY WITH FULL EMAIL
@api_view(['POST'])
def verify_payment(request):
    data = request.data

    appointment_id = data.get("appointment_id")

    appointment = get_object_or_404(Appointment, id=appointment_id)

    # Update status
    appointment.status = "CONFIRMED"
    appointment.save()

    # Save payment
    Payment.objects.create(
        name=appointment.name,
        email=appointment.email,
        amount=data.get("amount"),
        status="SUCCESS"
    )

    # ✅ FULL EMAIL WITH ALL DETAILS
    send_mail(
        'Appointment Confirmed ✅',
        f'''
Hello {appointment.name},

Your appointment has been successfully confirmed!

🧾 Appointment Details:
--------------------------------
👤 Name: {appointment.name}
📧 Email: {appointment.email}
📞 Phone: {appointment.phone}

👨‍⚕️ Doctor: {appointment.doctor}
📅 Date: {appointment.date}
⏰ Time: {appointment.time}

💳 Payment Details:
--------------------------------
Amount Paid: ₹{data.get("amount", 500)}
Status: SUCCESS

✅ Your slot is booked successfully.

Thank you for choosing our service!
        ''',
        settings.EMAIL_HOST_USER,
        [appointment.email],
        fail_silently=False,
    )

    return Response({"message": "Payment verified & appointment confirmed"})


@api_view(['GET'])
def get_payments(request):
    payments = Payment.objects.all().values()
    return Response(payments)


# ==================== DASHBOARD ENDPOINTS ====================

@api_view(['GET'])
def get_dashboard_stats(request):
    """Get all dashboard statistics"""
    
    # Count totals
    total_users = User.objects.count()
    total_appointments = Appointment.objects.count()
    total_confirmed = Appointment.objects.filter(status="CONFIRMED").count()
    total_payments = Payment.objects.count()
    
    # Payment statistics
    total_revenue = Payment.objects.filter(status="SUCCESS").aggregate(Sum('amount'))['amount__sum'] or 0
    pending_payments = Payment.objects.filter(status="Pending").count()
    completed_payments = Payment.objects.filter(status="SUCCESS").count()
    
    # Recent appointments
    recent_appointments = Appointment.objects.all().order_by('-id')[:5]
    recent_appointments_data = [{
        'id': apt.id,
        'name': apt.name,
        'doctor': apt.doctor,
        'date': str(apt.date),
        'time': str(apt.time),
        'status': apt.status
    } for apt in recent_appointments]
    
    # Appointments by status
    pending_apt = Appointment.objects.filter(status="PENDING").count()
    canceled_apt = Appointment.objects.filter(status="canceled").count()
    
    # Payment breakdown by method
    payment_methods = Payment.objects.values('method').annotate(count=Count('id'))
    
    # Daily appointments (last 7 days)
    today = datetime.now().date()
    daily_data = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        count = Appointment.objects.filter(date=date).count()
        daily_data.append({
            'date': str(date),
            'count': count
        })
    
    return Response({
        'total_users': total_users,
        'total_appointments': total_appointments,
        'total_confirmed': total_confirmed,
        'total_payments': total_payments,
        'total_revenue': total_revenue,
        'pending_payments': pending_payments,
        'completed_payments': completed_payments,
        'pending_appointments': pending_apt,
        'canceled_appointments': canceled_apt,
        'recent_appointments': recent_appointments_data,
        'payment_methods': list(payment_methods),
        'daily_appointments': daily_data,
    })