# serializers.py
from rest_framework import serializers
from .models import User, Group, File,Profile
from rest_framework_simplejwt.tokens import RefreshToken



class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ['profile_pic']
        
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','profile', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile']

    
    




class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields=['id','username','first_name','last_name','profile','token']
        
    def get_token(self,obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Group
        fields = ['group_id', 'name', 'picture', 'created', 'members', 'creator']


class CreateGroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = Group
        fields = ['name', 'picture', 'members']  # Exclude 'group_id', 'created', 'creator' fields for creation

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        group = Group.objects.create(**validated_data)
        if members:
            # Set members using the provided IDs
            group.members.set(members)
        return group
    
    def validate_name(self, value):
        if Group.objects.filter(name=value).exists():
            raise serializers.ValidationError(f" {value} nomli guruh allaqachon yaratilgan!")
        return value
    

class FileSerializer(serializers.ModelSerializer):
    who_can_see = UserSerializer(many=True, read_only=True)
    sender = UserSerializer(read_only=True)
    file_size = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['file_id', 'sender', 'file_name', 'comment', 'created', 'who_can_see', 'updated', 'file_url', 'file_size']

    def get_file_size(self, obj):
        return obj.file_size()

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class FileUploadSerializer(serializers.ModelSerializer):
    who_can_see = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = File
        fields = ['file', 'comment', 'who_can_see']
        
        
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def validate(self, attrs):
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError("New password cannot be the same as the old password")
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    
    
    


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_pic']

    def update(self, instance, validated_data):
        # Update user fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile picture if provided
        profile_pic = validated_data.get('profile_pic')
        if profile_pic:
            profile, created = Profile.objects.get_or_create(user=instance)
            profile.profile_pic = profile_pic
            profile.save()

        return instance