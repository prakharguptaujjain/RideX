from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.utils import timezone
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    
class Companion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_companions')
    companion = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companion_users')

class Ride(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trip_id = models.CharField(max_length=10, unique=True)
    unique_id=models.CharField(max_length=50,unique=True)
    trip_name = models.CharField(max_length=300)
    driver_name = models.CharField(max_length=100)
    driver_phone_number = models.CharField(max_length=15)
    cab_number = models.CharField(max_length=15)
    start_location_xcoordinate = models.CharField(max_length=255)
    end_location_xcoordinate = models.CharField(max_length=255)
    start_location_ycoordinate = models.CharField(max_length=255)
    end_location_ycoordinate = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    distance = models.FloatField(default=0)
    additional_notes = models.TextField()

class AuditTrail(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    location_xcoordinates = models.CharField(max_length=255)
    location_ycoordinates = models.CharField(max_length=255)


class Feedback(models.Model):
    trip = models.ForeignKey(Ride, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comments = models.TextField()
    is_traveler_feedback = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class AuthenticationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    expiry_timestamp = models.DateTimeField()

    @staticmethod
    def create_token(user):
        token = AuthenticationToken(user=user, token=uuid.uuid4(), expiry_timestamp=timezone.now() + timezone.timedelta(days=7))
        token.save()
        return token
    
    @staticmethod
    def check_token(token):
        try:
            token = AuthenticationToken.objects.get(token=token)
            if token.expiry_timestamp < timezone.now():
                return None
            return token.user
        except AuthenticationToken.DoesNotExist:
            return None

    @staticmethod
    def delete_token(token):
        try:
            token = AuthenticationToken.objects.get(token=token)
            token.delete()
        except AuthenticationToken.DoesNotExist:
            pass