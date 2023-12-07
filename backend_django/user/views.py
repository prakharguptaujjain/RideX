from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from .serializers import UserSerializer
from .models import User,AuthenticationToken,Ride,AuditTrail,Feedback,Companion
import json
from django.utils import timezone
import math


# Create your views here.
class LOGIN_LOGON:
    class REGISTER(APIView):
        def post(self, request):
            serializer=UserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({'status':400,'message':'Bad Request'})
            serializer.save()
            response=Response({'status':200,'message':'User created successfully'})
            return response

    class LOGIN(APIView):
        def post(self, request):
            username=request.data['username']
            password=request.data['password']
            user=authenticate(username=username, password=password)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Either username or password is incorrect'
                })
            
            if not user.is_active:
                return Response({
                    'status': 401,
                    'message': 'User not active!'
                })   
            
            login(request, user)

            access_token=AuthenticationToken.create_token(user)
            is_admin=user.is_admin
            return Response({
                'status': 200,
                'message': 'Login successful!',
                'access_token': access_token.token,
                'is_admin': is_admin
            })
    
    class LOGOUT(APIView):
        def post(self, request):
            data=json.loads(request.body)
            access_token=data['access_token']
            AuthenticationToken.delete_token(access_token)
            return Response({
                'status': 200,
                'message': 'Logout successful!'
            })

class ADMIN:
    class Check_admin(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            if user.is_admin:
                return Response({
                    'status': 200,
                    'is_admin': True
                })
            else:
                return Response({
                    'status': 200,
                    'is_admin': False
                })
            
    class Users(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            if not user.is_admin:
                return Response({
                    'status': 401,
                    'message': 'You are not an admin!'
                })
            
            all_users=User.objects.all()
            data=[]
            for user in all_users:
                data.append({
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username,
                    'email': user.email,
                })
            return Response({
                'status': 200,
                'data': data
            })
        
    class User_Rides(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            if not user.is_admin:
                return Response({
                    'status': 401,
                    'message': 'You are not an admin!'
                })
            username=data['username']
            if username=='-1' or username=="null":
                all_rides=Ride.objects.all()
                data=[]
                for ride in all_rides:
                    data.append({
                        'trip_id': ride.trip_id,
                        'trip_name': ride.trip_name,
                        'driver_phone_number': ride.driver_phone_number,
                        'cab_number': ride.cab_number,
                        'start_time': ride.start_time,
                        'end_time': ride.end_time,
                    })
                return Response({
                    'status': 200,
                    'data': data
                })
            user = User.objects.get(username=username)
            all_rides=Ride.objects.filter(user=user)
            data=[]
            for ride in all_rides:
                data.append({
                    'trip_id': ride.trip_id,
                    'trip_name': ride.trip_name,
                    'driver_phone_number': ride.driver_phone_number,
                    'cab_number': ride.cab_number,
                    'start_time': ride.start_time,
                    'end_time': ride.end_time,
                })
            return Response({
                'status': 200,
                'data': data
            })
        
    class View_Ride(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            if not user.is_admin:
                return Response({
                    'status': 401,
                    'message': 'You are not an admin!'
                })
            trip_id=data['trip_id']
            ride=Ride.objects.get(trip_id=trip_id)
            audit_trail=AuditTrail.objects.filter(ride=ride)
            audit_trail_data=[]
            for audit in audit_trail:
                audit_trail_data.append({
                    'timestamp': audit.timestamp,
                    'location_xcoordinates': audit.location_xcoordinates,
                    'location_ycoordinates': audit.location_ycoordinates,
                })
            data={'detail':{
                'trip_id': ride.trip_id,
                'unique_id': ride.unique_id,
                'trip_name': ride.trip_name,
                'driver_phone_number': ride.driver_phone_number,
                'cab_number': ride.cab_number,
                'start_time': ride.start_time,
                'end_time': ride.end_time,
                'start_location_xcoordinate': ride.start_location_xcoordinate,
                'start_location_ycoordinate': ride.start_location_ycoordinate,
                'end_location_xcoordinate': ride.end_location_xcoordinate,
                'end_location_ycoordinate': ride.end_location_ycoordinate,
                'additional_notes': ride.additional_notes,
            },
            'audit_trail': audit_trail_data
            }
            return Response({
                'status': 200,
                'data': data
            })

class User_function:
    class create_companion(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            first_name=data['first_name']
            last_name=data['last_name']
            companion_username=data['companion_username']
            try:
                companion=User.objects.get(username=companion_username,first_name=first_name,last_name=last_name)
            except User.DoesNotExist:
                return Response({
                    'status': 401,
                    'message': 'Invalid companion details'
                })
            companion=Companion(user=user,companion=companion)
            companion.save()
            return Response({
                'status': 200,
                'message': 'Companion added successfully!'
            })
    
    class remove_companion(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            companion_username=data['companion_username']
            try:
                companion=User.objects.get(username=companion_username)
            except User.DoesNotExist:
                return Response({
                    'status': 401,
                    'message': 'Invalid companion details'
                })
            companion=Companion.objects.get(user=user,companion=companion)
            companion.delete()
            return Response({
                'status': 200,
                'message': 'Companion removed successfully!'
            })
    class get_companions(APIView):
        def post(self,request):
            data=json.loads(request.body)
            access_token=data['access_token']
            user=AuthenticationToken.check_token(access_token)
            if user is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid access token'
                })
            companions=Companion.objects.filter(user=user)
            data=[]
            for companion in companions:
                data.append({
                    'first_name': companion.companion.first_name,
                    'last_name': companion.companion.last_name,
                    'username': companion.companion.username,
                    'email': companion.companion.email,
                })
            return Response({
                'status': 200,
                'data': data
            })
        
    def past_7_days_distance(self,request):
        data=json.loads(request.body)
        access_token=data['access_token']
        user=AuthenticationToken.check_token(access_token)
        if user is None:
            return Response({
                'status': 401,
                'message': 'Invalid access token'
            })
        # where time is less than 7 days
        trips=Ride.objects.filter(user=user,start_time__gte=timezone.now()-timezone.timedelta(days=7))
        distance={}
        for trip in trips:
            diff=timezone.now().date()-trip.start_time.date()
            if trip.end_time is not None and trip.end_time >= trip.start_time:
                if diff<=1:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=2:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=3:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=4:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=5:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=6:
                    distance[diff]=distance.get(diff,0)+trip.distance
                elif diff<=7:
                    distance[diff]=distance.get(diff,0)+trip.distance

        curr_day=timezone.now().date()
        return_data=[]
        for i in range(7):
            return_data.append({
                'date': curr_day-timezone.timedelta(days=i),
                'distance': distance.get(i,0)
            })

        return Response({
            'status': 200,
            'data': return_data
        })


    def past_7_days_time(self,request):
        data=json.loads(request.body)
        access_token=data['access_token']
        user=AuthenticationToken.check_token(access_token)
        if user is None:
            return Response({
                'status': 401,
                'message': 'Invalid access token'
            })
        # where time is less than 7 days
        trips=Ride.objects.filter(user=user,start_time__gte=timezone.now()-timezone.timedelta(days=7))
        time={}
        for trip in trips:
            diff=timezone.now().date()-trip.start_time.date()
            if trip.end_time is not None and trip.end_time >= trip.start_time:
                time[math.floor(diff.total_seconds()/(60*60*24))]=time.get(math.floor(diff.total_seconds()/(60*60*24)),0)+(trip.end_time-trip.start_time).total_seconds()/(60*60)
        curr_day=timezone.now().date()
        return_data=[]
        for i in range(7):
            return_data.append({
                'date':i,
                'time':time.get(i,0)
            })

        return Response({
            'status': 200,
            'data': return_data
        })
    
    def past_year_trips_count(self,request):
        data=json.loads(request.body)
        access_token=data['access_token']
        user=AuthenticationToken.check_token(access_token)
        if user is None:
            return Response({
                'status': 401,
                'message': 'Invalid access token'
            })
        month_map={
            'jan':31,
            'feb':28,
            'mar':31,
            'apr':30,
            'may':31,
            'jun':30,
            'jul':31,
            'aug':31,
            'sep':30,
            'oct':31,
            'nov':30,
            'dec':31
        }
        # if leap year
        if timezone.now().year%4==0 and (timezone.now().year%100!=0 or timezone.now().year%400==0):
            month_map['feb']=29

        # where time is less than 365 days
        trips=Ride.objects.filter(user=user,start_time__gte=timezone.now()-timezone.timedelta(days=365))
        count={}
        for trip in trips:
            diff=timezone.now().date()-trip.start_time.date()
            if trip.end_time is not None and trip.end_time >= trip.start_time:
                count[diff//30]=count.get(diff//30,0)+1

        curr_day=timezone.now().date()
        return_data=[]
        for i in range(12):
            return_data.append({
                'month': curr_day.month-i,
                'trips': count.get(i,0)
            })

        return Response({
            'status': 200,
            'data': return_data
        })
        
class DASHBOARD(APIView):
    def post(self,request):
        data=json.loads(request.body)
        access_token=data['access_token']

        user=AuthenticationToken.check_token(access_token)
        if user is None:
            return Response({
                'status': 401,
                'message': 'Invalid access token'
            })
        trips=Ride.objects.filter(user=user)
        total_trips=0
        total_distance=0
        total_time=0
        for trip in trips:
            if trip.end_time is not None and trip.end_time >= trip.start_time:
                total_distance+=trip.distance
                total_time+=(trip.end_time-trip.start_time).total_seconds()
                total_trips+=1
        companions_cnt=Companion.objects.filter(user=user).count()
        return_data={
            'total_trips': total_trips,
            'total_distance': total_distance,
            'total_time': total_time,
            'companions_cnt': companions_cnt
        }
        return Response({
            'status': 200,
            'data': return_data
        })

class RIDE_VIEW:
        
    class RIDE_DETAIL(APIView):
        def get(self, request, unique_id):
            try:
                ride=Ride.objects.get(unique_id=unique_id)
            except Ride.DoesNotExist:
                return Response({
                    'status': 401,
                    'message': 'Invalid trip id'
                })
            if ride is None:
                return Response({
                    'status': 401,
                    'message': 'Invalid trip id'
                })
            
            # check if trip expired
            if ride.end_time is not None and ride.end_time >= ride.start_time:
                print(ride.end_time >= ride.start_time)
                return Response({
                    'status': 401,
                    'message': 'Trip expired'
                })
            link='http://127.0.0.1:8000/ViewRide/'+ride.unique_id
            audit_trail=AuditTrail.objects.filter(ride=ride)
            audit_trail_data=[]
            for audit in audit_trail:
                audit_trail_data.append({
                    'timestamp': audit.timestamp,
                    'location_xcoordinates': audit.location_xcoordinates,
                    'location_ycoordinates': audit.location_ycoordinates,
                })
            data={'detail':{
                'trip_id': ride.trip_id,
                'unique_id': ride.unique_id,
                'trip_name': ride.trip_name,
                'driver_phone_number': ride.driver_phone_number,
                'cab_number': ride.cab_number,
                'start_time': ride.start_time,
                'end_time': ride.end_time,
                'start_location_xcoordinate': ride.start_location_xcoordinate,
                'start_location_ycoordinate': ride.start_location_ycoordinate,
                'end_location_xcoordinate': ride.end_location_xcoordinate,
                'end_location_ycoordinate': ride.end_location_ycoordinate,
                'additional_notes': ride.additional_notes,
                'link': link
            },
            'audit_trail': audit_trail_data
            }
            return Response({
                'status': 200,
                'data': data
            })