import secrets

from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from caffe.models import Coffee
from userapp.models import User, Seller


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('full_name','email', 'password', 'confirm_password' , 'role' )

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    def validate_email(self, email):

        if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email already registered")
        return email

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            verification_token = secrets.token_urlsafe(32),
            is_active = False

        )
        user.set_password(password)
        user.save()
        return user


class SellerRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    phone_number = serializers.CharField(style={'input_type': 'number'}, write_only=True)
    full_name = serializers.CharField(style={'input_type': 'text'}, write_only=True)
    description = serializers.CharField(style={'input_type': 'text'}, write_only=True)
    address = serializers.CharField(style={'input_type': 'text'}, write_only=True)

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already registered")
        return email

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number')
        description = validated_data.pop('description', '')
        address = validated_data.pop('address', '')
        try :
            user = User.objects.create_user(
                username=validated_data['email'],
                email=validated_data['email'],
                full_name=validated_data['full_name'],
                role= 'seller',
                verification_token = secrets.token_urlsafe(32),
                is_active = False

            )
            user.set_password(password)
            user.save()

            seller = Seller.objects.create(
                user=user,
                phone_number = phone_number,
                description = description,
                address = address,
            )

            print(f"Successfully created user {user.id} and seller {seller.id}")
            return user
        except Exception as e:
            print(f"Error creating seller: {e}")
            raise serializers.ValidationError(f"Failed to create seller account: {str(e)}")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email or password is required")

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email does not exist")

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid password")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        refresh = self.get_token(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'email': user.email
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        return token

class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            pass
        return email


class SellerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email' , read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Seller
        fields = ('email', 'full_name' , 'description' , "phone_number" , "address", "image")


class CustomProfileSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields ='__all__'



class AddImageProfileSellerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seller
        fields =['image']

    def validate(self, attrs):
        image = attrs.get('image')
        if not image :
            raise serializers.ValidationError("Image field is required")
        return attrs

    def update(self, instance, validated_data):
        image = validated_data.pop('image')
        user = self.context['request'].user


        instance.image = image
        instance.save()
        return instance




class UpdateSellerProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    class Meta:
        model = Seller
        fields =['full_name', 'email', 'phone_number', 'address', 'description']

    def update(self, instance, validated_data):

        user_data = validated_data.pop('user', {})

        user = instance.user
        full_name = user_data.get('full_name')
        email = user_data.get('email')

        if full_name:
            user.full_name = full_name
        if email:
            user.email = email
        user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'full_name', 'email' ]

class UserSerializerOneField(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'full_name']


class GetAllRestaurnetsSerializer(serializers.ModelSerializer):
    user = UserSerializerOneField(read_only=True)
    class Meta:
        model = Seller
        fields = ['id', 'user', 'phone_number', 'description', 'address', 'image', 'rating']


class SearchRestaurantsSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required = True)
    class Meta:
        model = Seller
        fields = ['id', 'user', 'phone_number', 'description', 'address', 'image' , 'rating']


class RestaurantSerializer(serializers.ModelSerializer):
    user = UserSerializerOneField(read_only =True)
    class Meta:
        model = Seller
        fields = '__all__'


class RateRestaurentSerializer(serializers.ModelSerializer):
    pass


class CoffeeRestaurantSerializer(serializers.ModelSerializer):

    seller = RestaurantSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['full_name ' , 'seller']