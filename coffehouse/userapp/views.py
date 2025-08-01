from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.shortcuts import render
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from coffehouse import settings
from userapp.models import User, Seller
from userapp.permissions import IsSellerPermission
from userapp.serializers import UserRegisterSerializer, CustomTokenObtainPairSerializer, ResetPasswordRequestSerializer, \
    SellerRegisterSerializer, SellerProfileSerializer


# Create your views here.
class UserRegisterView(APIView):
    serializer_class = UserRegisterSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        try:
            self.send_verification_mail(user)
            message = "Account created successfully , please check your email to activate your account"
        except Exception as e:
            print(f"email sinding failed: {e}")
            message = "something went wrong please try again later"

        return Response(
            {"message": message,
             "email": user.email},
            status=status.HTTP_201_CREATED)


    def send_verification_mail(self, user):

        verification_url = f"{settings.FRONTEND_URL}/verification/{user.verification_token}"
        subjuct = "Activate Account"
        message = f"""
        Hello {user.full_name},
        
        Thank you for registering as an coffeHouse. Please click the link below to verify your email address:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create this account, please ignore this email.
        
        Best regards,
        Best Time for coffe ;
        Coffe House :) 
        
        """
        send_mail(
            subject=subjuct,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

@api_view(['POST'])
def verify_token(request, token):
    try:
        user = User.objects.get(
            verification_token=token,
            email_confirmed=False
        )
        user.email_verified = True
        user.is_active = True
        user.save()
        return Response(
            {"message": "Account verified",
                "success": True},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"message": "Invalid or expired verification token",
                    "error": e,
                "success": False
             },
            status=status.HTTP_400_BAD_REQUEST
        )

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

        except ValidationError:
            return Response({'detail': 'Invalid credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)
        access = serializer.validated_data['access']
        refresh = serializer.validated_data['refresh']
        role = serializer.validated_data['role']

        response = Response({'message': 'Login successful', 'role': role , 'access': access, 'refresh': refresh},
                            status=status.HTTP_200_OK)

        response.set_cookie(
            key='access',
            value=access,
            httponly=True,
            secure=False,
            samesite = 'Lax',
            max_age=3600)
        response.set_cookie(
            key='refresh',
            value=refresh,
            httponly=True,
            secure=False,
            samesite = 'Lax',
            max_age=60*60*24
        )

        return response
'''
@api_view(['POST'])
def ResetPasswordRequestView(request):

    serializer = ResetPasswordRequestSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            pass
'''


class SellerRegisterView(APIView):
    serializer_class = SellerRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        try:
            self.send_verification_mail(user)
            message = "Account created successfully , please check your email to activate your account"
        except Exception as e:
            print(f"email sinding failed: {e}")
            message = "something went wrong please try again later"

        return Response(
            {"message": message,
             "email": user.email},
            status=status.HTTP_201_CREATED )

    def send_verification_mail(self, user):

        verification_url = f"{settings.FRONTEND_URL}/verification/{user.verification_token}"
        subjuct = "Activate Account"
        message = f"""
        Hello {user.full_name},

        Thank you for registering as an coffeHouse. Please click the link below to verify your email address:

        {verification_url}

        This link will expire in 24 hours.

        If you didn't create this account, please ignore this email.

        Best regards,
        Best Time for coffe ;
        Coffe House :) 

        """
        send_mail(
            subject=subjuct,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )


class SellerProfileView(APIView):

    permission_classes = [IsSellerPermission]
    def get(self, request, *args, **kwargs):
        print(f"User: {request.user}")
        print(f"User role: {request.user.role}")
        print(f"Has seller attr: {hasattr(request.user, 'seller')}")
        try :
            seller = request.user.seller

        except ObjectDoesNotExist:
            return Response({"error": "Seller profile not found here."}, status=404)
        serializer = SellerProfileSerializer(seller)
        return Response(serializer.data)


class Logout(APIView):

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get('refresh')
        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()


        response = Response({"message": "Logged out and token blacklisted"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response