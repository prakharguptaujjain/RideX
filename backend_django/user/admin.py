from django.contrib import admin
from .models import User, Ride, AuditTrail, Feedback, AuthenticationToken

# Register your models here.
admin.site.register(User)
admin.site.register(Ride)
admin.site.register(AuditTrail)
admin.site.register(Feedback)
admin.site.register(AuthenticationToken)

