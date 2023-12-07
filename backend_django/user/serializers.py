from rest_framework import serializers
from .models import User
from rest_framework.response import Response

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','first_name','last_name','password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if User.objects.filter(username=validated_data['username']).exists():
            response=Response({'status':400,'message':'User already exists'})
            return response
        user = self.Meta.model.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        if validated_data['password']:
            user.set_password(validated_data['password'])
            user.save()
        return user
        