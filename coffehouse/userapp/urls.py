from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from userapp.views import UserRegisterView, verify_token, CustomTokenObtainPairView, SellerProfileView, \
    SellerRegisterView

urlpatterns = [

    path("auth/register/" , UserRegisterView.as_view() , name="register"),
    path("auth/register/seller" , SellerRegisterView.as_view() , name="register"),
    path("auth/verify-token/<str:token>/", verify_token, name="verify_token"),
    path("auth/login/" , CustomTokenObtainPairView.as_view() , name="login"),
    path("profile/seller/" , SellerProfileView.as_view() , name="seller_profile"),
    path("auth/logout/", LogoutView.as_view() , name="logout"),

]