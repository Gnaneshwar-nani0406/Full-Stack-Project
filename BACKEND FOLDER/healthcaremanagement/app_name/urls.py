from django.urls import path
from . import views

urlpatterns = [
    # Dashboard HTML Page
    path('dashboard/', views.dashboard),  # http://localhost:8000/api/dashboard/
    
    # Dashboard Statistics API
    path('dashboard-stats/', views.get_dashboard_stats),  # http://localhost:8000/api/dashboard-stats/
    
    # Other API Endpoints
    path('test/', views.test_api),
    path('save/', views.save_appointment),

    path('register/', views.register_user),
    path('login/', views.login_user),

    path('book/', views.save_appointment),
    path('appointments/', views.get_appointments),
    path('delete/<int:id>/', views.cancel_appointment),

    path('payment-success/', views.payment_success),
    path('verify-payment/', views.verify_payment),
    path('create-order/', views.create_order),
    path('payments/', views.get_payments),
    path('users/', views.get_users),
]