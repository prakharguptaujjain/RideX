from django.urls import path
from .views import *

urlpatterns = [
    path('is_admin/', ADMIN.Check_admin.as_view()),
    path('users/', ADMIN.Users.as_view()),
    path('user_rides/', ADMIN.User_Rides.as_view()),
    path('view_ride/', ADMIN.View_Ride.as_view()),
]