from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from rest_framework.parsers import MultiPartParser

import json
from .models import User, Group, File
from .serializers import UserSerializer,UserSerializerWithToken, GroupSerializer, FileSerializer,CreateGroupSerializer,FileUploadSerializer







class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
        def validate(self, attrs):
            data = super().validate(attrs)

            serializer = UserSerializerWithToken(self.user).data
            for k,v in serializer.items():
                data[k] = v
            return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_files(request):
    if request.method == 'GET':
        current_user=request.user
        files = File.objects.filter(who_can_see=current_user)
        serializer = FileSerializer(files, many=True,context={'request': request})
        return Response(serializer.data)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_files(request):
    if request.method == 'GET':
        current_user=request.user
        files = File.objects.filter(sender=current_user)
        serializer = FileSerializer(files, many=True,context={'request': request})
        return Response(serializer.data)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_groups(request):
    if request.method == 'GET':
        current_user=request.user
        groups = Group.objects.filter(creator=current_user)
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    serializer = CreateGroupSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        group = serializer.save(creator=request.user)
        return Response(CreateGroupSerializer(group).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def file_upload(request):
    files = request.FILES.getlist('file')
    comment = request.data.get('comment', '')
    who_can_see = request.data.get('who_can_see', '')

    user = request.user
    file_objects = []

    for uploaded_file in files:
        file_instance = File(
            file=uploaded_file,
            file_name=uploaded_file.name,
            comment=comment,
            sender=user
        )
        file_instance.save()

        # Handle many-to-many relationships
        if who_can_see:
            who_can_see_data = json.loads(who_can_see)
            users = who_can_see_data.get('users', [])
            
            # Add users
            file_instance.who_can_see.set(users)

        file_objects.append(file_instance)

    serializer = FileUploadSerializer(file_objects, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)