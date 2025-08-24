from django.contrib.auth.tokens import default_token_generator
from django.contrib.postgres.search import TrigramSimilarity
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from caffe.models import Coffee
from coffehouse import settings
from userapp.models import User, Seller
from userapp.permissions import IsSellerPermission
from userapp.serializers import UserRegisterSerializer, CustomTokenObtainPairSerializer, ResetPasswordRequestSerializer, \
    SellerRegisterSerializer, SellerProfileSerializer, AddImageProfileSellerSerializer, UpdateSellerProfileSerializer, \
    GetAllRestaurnetsSerializer, SearchRestaurantsSerializer, RestaurantSerializer


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
        return Response(serializer.data , status= status.HTTP_200_OK)


class Sortir(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        print(f"=== LOGOUT DEBUG ===")
        print(f"Request method: {request.method}")
        print(f"Request data: {request.data}")
        print(f"Content-Type: {request.content_type}")
        print(f"Authorization header: {request.headers.get('Authorization', 'Not present')}")
        print(f"===================")
        refresh  = request.data.get("refresh_token")
        print(refresh)

        if not refresh:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(
                {"message": "Logged out and token blacklisted"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Invalid token or token already blacklisted"},
                status=status.HTTP_400_BAD_REQUEST
            )


class AddImageSellerProfileView(APIView):
    permission_classes = [IsSellerPermission]
    def patch(self, request, *args, **kwargs):
        user = request.user

        try:
            seller = user.seller
        except Seller.DoesNotExist:
            return Response({
                'error': 'Seller profile does not exist'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AddImageProfileSellerSerializer(seller , data=request.data,
                                             context={'request': request})


        if serializer.is_valid(raise_exception=True):
            updated_seller = serializer.save()
            return  Response({
                'message': 'Image added successfully',
                'data': {
                    'id': updated_seller.id,
                    'image': request.build_absolute_uri(updated_seller.image.url) if updated_seller.image else None,
                    'full_name': updated_seller.user.full_name,
                    'email': updated_seller.user.email,
                    'phone_number': updated_seller.phone_number,
                    'address': updated_seller.address,
                    'description': updated_seller.description,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)


class SellerProfileUpdateView(RetrieveUpdateAPIView):
    serializer_class = UpdateSellerProfileSerializer
    permission_classes = [IsSellerPermission]

    def get_object(self):

        return self.request.user.seller


class GetAllRestaurants(ListAPIView):
    serializer_class = GetAllRestaurnetsSerializer

    def get_queryset(self):

        cached_date = cache.get('restaurants')
        if cached_date:
            return cached_date
        queryset = Seller.objects.all().order_by('id')
        cache.set('restaurants', queryset, 60 * 5)
        return queryset


class SearchRestaurantsView(ListAPIView):
    serializer_class = SearchRestaurantsSerializer

    def get_queryset(self):
        queryset = Seller.objects
        address = self.request.query_params.get('address')

        queryset = queryset.annotate(
            similarity=TrigramSimilarity('address', address)
        ).filter(similarity__gt=0.2).order_by('-similarity')

        return queryset

class GetRestaurentById(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    queryset = Seller.objects.all()

