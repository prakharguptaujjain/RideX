from django.urls import path
from .views import *

urlpatterns = [
    path('register/', LOGIN_LOGON.REGISTER.as_view()),
    path('login/', LOGIN_LOGON.LOGIN.as_view()),
    path('logout/', LOGIN_LOGON.LOGOUT.as_view()),
    path('dashboard/', DASHBOARD.as_view()),
]