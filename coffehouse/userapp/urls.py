from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from userapp.views import UserRegisterView, verify_token, CustomTokenObtainPairView, SellerProfileView, \
    SellerRegisterView, AddImageSellerProfileView, SellerProfileUpdateView, GetAllRestaurants, SearchRestaurantsView, \
    GetRestaurentById

urlpatterns = [

    path("auth/register/" , UserRegisterView.as_view() , name="register"),
    path("auth/register/seller" , SellerRegisterView.as_view() , name="register"),
    path("auth/verify-token/<str:token>/", verify_token, name="verify_token"),
    path("auth/login/" , CustomTokenObtainPairView.as_view() , name="login"),
    path("profile/seller/" , SellerProfileView.as_view() , name="seller_profile"),
    path("auth/logout/", LogoutView.as_view() , name="logout"),
    path("profile/seller/addImage/" ,AddImageSellerProfileView.as_view() , name="add_image_seller_profile"),
    path("profile/seller/update/" ,SellerProfileUpdateView.as_view() , name="update_seller_profile"),
    path("allrestaurents/" , GetAllRestaurants.as_view() , name="allrestaurants"),
    path("search/restaurent/" , SearchRestaurantsView.as_view() , name="search_restaurant"),
    path("restaurent/<int:pk>/" , GetRestaurentById.as_view() , name="get_restaurent_by_id"),

]